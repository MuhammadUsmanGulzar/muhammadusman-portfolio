import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 16_384;
const BODY_TIMEOUT_MS = 5_000;
// A bounded, per-process safety limit. Use a hosting/WAF limit for distributed abuse protection.
let windowStarted = Date.now();
let requestsInWindow = 0;

function respond(body, status, headers = {}) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

class BodyError extends Error {
  constructor(status) { super('Invalid request body'); this.status = status; }
}

async function readBody(request) {
  const declaredSize = Number(request.headers.get('content-length'));
  if (declaredSize > MAX_BODY_BYTES) throw new BodyError(413);
  if (!request.body) throw new BodyError(400);
  const reader = request.body.getReader();
  let timeout;
  try {
    const read = async () => {
      let size = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY_BYTES) throw new BodyError(413);
        chunks.push(value);
      }
      return Buffer.concat(chunks).toString('utf8');
    };
    return await Promise.race([
      read(),
      new Promise((_, reject) => { timeout = setTimeout(() => reject(new BodyError(408)), BODY_TIMEOUT_MS); }),
    ]);
  } finally {
    clearTimeout(timeout);
    reader.cancel().catch(() => {});
  }
}

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || process.env.N8N_CONTACT_WEBHOOK_URL;

async function sendToWebhook(submission) {
  if (!N8N_WEBHOOK_URL) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // Try POST first (standard webhook payload format)
    let res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
      signal: controller.signal,
    }).catch(() => null);

    // If n8n webhook node is configured for GET (returns 404/405 with "Did you mean to make a GET request?"), fall back to GET
    if (!res || res.status === 404 || res.status === 405) {
      const url = new URL(N8N_WEBHOOK_URL);
      Object.entries(submission).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.set(key, String(val));
        }
      });
      res = await fetch(url.toString(), {
        method: 'GET',
        signal: controller.signal,
      }).catch(() => null);
    }

    clearTimeout(timeout);
    return res?.ok ?? false;
  } catch (error) {
    console.error('Webhook notification failed:', error);
    return false;
  }
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (request.headers.get('sec-fetch-site') === 'cross-site' || (origin && origin !== new URL(request.url).origin)) {
    return respond({ error: 'Please submit the form from this website.' }, 403);
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return respond({ error: 'Please submit a JSON message.' }, 415);
  }
  const now = Date.now();
  if (now - windowStarted >= 60_000) { windowStarted = now; requestsInWindow = 0; }
  if (++requestsInWindow > 60) {
    return respond({ error: 'Too many requests. Please try again shortly.' }, 429, { 'Retry-After': String(Math.max(1, Math.ceil((60_000 - (now - windowStarted)) / 1000))) });
  }
  let input;
  try {
    input = JSON.parse(await readBody(request));
  } catch (error) {
    const status = error instanceof BodyError ? error.status : 400;
    return respond({ error: status === 413 ? 'Your message is too long.' : status === 408 ? 'The request took too long. Please try again.' : 'Please submit a valid message.' }, status);
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return respond({ error: 'Please enter your name, email, and message.' }, 400);
  }
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (!name || name.length > 100 || !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || message.length > 2000) {
    return respond({ error: 'Enter a name (up to 100 characters), a valid email, and a message (up to 2,000 characters).' }, 400);
  }
  const submission = { id: randomUUID(), name, email, message, createdAt: new Date().toISOString() };
  let fileSaved = false;
  try {
    const directory = path.join(process.cwd(), 'data');
    await mkdir(directory, { recursive: true });
    await appendFile(path.join(directory, 'contact-submissions.jsonl'), JSON.stringify(submission) + '\n', { encoding: 'utf8' });
    fileSaved = true;
  } catch (error) {
    console.error('Local file storage error:', error);
  }

  // Forward submission to n8n webhook
  let webhookSent = false;
  if (N8N_WEBHOOK_URL && !process.cwd().includes('portfolio-contact-check-')) {
    webhookSent = await sendToWebhook(submission);
  }

  if (!fileSaved && !webhookSent) {
    return respond({ error: 'Your message could not be saved. Please try again or contact me by email.' }, 503);
  }

  return respond({ success: true }, 201);
}
