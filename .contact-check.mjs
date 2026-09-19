import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const source = await readFile('src/app/api/contact/route.js', 'utf8');
const { POST } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const originalDirectory = process.cwd();
const testDirectory = await mkdtemp(path.join(tmpdir(), 'portfolio-contact-check-'));
const valid = { name: ' Test Visitor ', email: 'test@example.com', message: 'A test enquiry\nSecond line' };
const send = (body, headers = {}) => POST(new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body }));
process.chdir(testDirectory);
try {
  for (const body of ['{', 'null', '[]', '42']) assert.equal((await send(body)).status, 400);
  assert.equal((await send(JSON.stringify({ ...valid, email: 'invalid' }))).status, 400);
  assert.equal((await send(JSON.stringify({ ...valid, name: 'x'.repeat(101) }))).status, 400);
  assert.equal((await send(JSON.stringify({ ...valid, message: ' ' }))).status, 400);
  assert.equal((await send(JSON.stringify({ ...valid, message: 'x'.repeat(2001) }))).status, 400);
  assert.equal((await send('x'.repeat(16385))).status, 413);
  assert.equal((await send('{}', { 'Content-Length': '16385' })).status, 413);
  assert.equal((await send(JSON.stringify(valid), { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await send(JSON.stringify(valid), { Origin: 'https://untrusted.example' })).status, 403);
  assert.equal((await send(JSON.stringify(valid), { 'Sec-Fetch-Site': 'cross-site' })).status, 403);

  let cancelled = false;
  let pulled = 0;
  const oversizedStream = new ReadableStream({
    pull(controller) { pulled++; controller.enqueue(new Uint8Array(8192)); },
    cancel() { cancelled = true; },
  });
  const oversizedResponse = await POST(new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: oversizedStream, duplex: 'half' }));
  assert.equal(oversizedResponse.status, 413);
  assert.ok(cancelled && pulled <= 4, 'Reject and cancel a streaming payload without buffering it all.');
  const stalled = new ReadableStream({});
  assert.equal((await POST(new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: stalled, duplex: 'half' }))).status, 408);

  const response = await send(JSON.stringify(valid), { Origin: 'http://localhost' });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const stored = JSON.parse(await readFile('data/contact-submissions.jsonl', 'utf8'));
  assert.equal(stored.name, 'Test Visitor');
  assert.equal(stored.email, valid.email);
  assert.equal(stored.message, valid.message);
  assert.ok(stored.id && stored.createdAt);

  await mkdir('blocked');
  await writeFile('blocked/data', 'A file prevents creating a storage directory.');
  process.chdir(path.join(testDirectory, 'blocked'));
  assert.equal((await send(JSON.stringify(valid))).status, 503, 'Never report success when persistence fails.');
  process.chdir(testDirectory);

  let limited;
  for (let index = 0; index < 61; index++) limited = await send('{}');
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('Retry-After')) > 0);
  assert.equal((await readFile('data/contact-submissions.jsonl', 'utf8')).trim().split('\n').length, 1);
  console.log('PASS: validation, origin/content-type checks, bounded streaming, timeout, persistence, honest storage failure, no-store responses, and request throttling.');
} finally {
  process.chdir(originalDirectory);
  const resolved = path.resolve(testDirectory);
  if (path.dirname(resolved) !== path.resolve(tmpdir()) || !path.basename(resolved).startsWith('portfolio-contact-check-')) throw new Error('Unexpected test cleanup path');
  await rm(resolved, { recursive: true, force: true });
}
