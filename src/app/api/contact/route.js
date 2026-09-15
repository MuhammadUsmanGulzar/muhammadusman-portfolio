import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';

export async function POST(request) {
  let input;
  try {
    const body = await request.text();
    if (Buffer.byteLength(body, 'utf8') > 16384) {
      return Response.json({ error: 'Your message is too long.' }, { status: 413 });
    }
    input = JSON.parse(body);
  } catch {
    return Response.json({ error: 'Please submit a valid message.' }, { status: 400 });
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return Response.json({ error: 'Please enter your name, email, and message.' }, { status: 400 });
  }
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (!name || name.length > 100 || !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || message.length > 2000) {
    return Response.json({ error: 'Enter a name (up to 100 characters), a valid email, and a message (up to 2,000 characters).' }, { status: 400 });
  }
  const submission = { id: randomUUID(), name, email, message, createdAt: new Date().toISOString() };
  try {
    // Replace this file write with a database insert when database storage is ready.
    // Keep submissions outside public/ so visitor messages cannot be downloaded.
    const directory = path.join(process.cwd(), 'data');
    await mkdir(directory, { recursive: true });
    await appendFile(path.join(directory, 'contact-submissions.jsonl'), JSON.stringify(submission) + '\n', { encoding: 'utf8', mode: 0o600 });
  } catch {
    return Response.json({ error: 'Your message could not be saved. Please try again or contact me by email.' }, { status: 503 });
  }
  return Response.json({ success: true }, { status: 201 });
}
