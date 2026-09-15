import assert from 'node:assert/strict';
import { readFile, mkdtemp, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
const source = await readFile('src/app/api/contact/route.js', 'utf8');
const { POST } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const originalDirectory = process.cwd();
const testDirectory = await mkdtemp(path.join(tmpdir(), 'portfolio-contact-check-'));
process.chdir(testDirectory);
try {
  const send = body => POST(new Request('http://localhost/api/contact', { method: 'POST', headers: {'Content-Type':'application/json'}, body }));
  assert.equal((await send('{')).status, 400);
  assert.equal((await send(JSON.stringify({name:'Test',email:'invalid',message:'Hello'}))).status, 400);
  assert.equal((await send(JSON.stringify({name:'Test',email:'test@example.com',message:' '.repeat(20)}))).status, 400);
  assert.equal((await send(JSON.stringify({name:'Test',email:'test@example.com',message:'x'.repeat(2001)}))).status, 400);
  assert.equal((await send('x'.repeat(16385))).status, 413);
  const response = await send(JSON.stringify({name:' Test Visitor ',email:'test@example.com',message:'A test enquiry\nSecond line'}));
  assert.equal(response.status, 201);
  const stored = JSON.parse(await readFile('data/contact-submissions.jsonl','utf8'));
  assert.equal(stored.name, 'Test Visitor');
  assert.equal(stored.email, 'test@example.com');
  assert.equal(stored.message, 'A test enquiry\nSecond line');
  assert.ok(stored.id && stored.createdAt);
  console.log('Passed: successful submission persists all fields; invalid email, empty message, oversized message, malformed JSON and excessive payload are rejected.');
} finally {
  process.chdir(originalDirectory);
  await unlink(path.join(testDirectory,'data','contact-submissions.jsonl')).catch(()=>{});
  await rmdir(path.join(testDirectory,'data')).catch(()=>{});
  await rmdir(testDirectory);
}
