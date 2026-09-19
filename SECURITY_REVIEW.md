# Security review — 2026-09-19

Scope: portfolio source, lockfile advisories, contact API, repository exclusions, browser headers, and isolated-view navigation. This is a code and dependency review, not a penetration test of the hosted site.

## Findings addressed

- Updated js-yaml to 4.3.2 through its existing dependency range. The original lockfile contained a high-severity YAML processing advisory: https://github.com/advisories/GHSA-2883-xcg3-v3hh.
- Pinned the transitive PostCSS dependency to 8.5.23 with an npm override, resolving the reported PostCSS advisories without a Next.js major upgrade. Patched version reference: https://github.com/advisories/GHSA-fxqj-rqcc-2cmp. Recheck this override during future Next.js upgrades.
- The contact API previously buffered the entire request before checking its size. It now reads at most 16 KiB, cancels oversized streams, and times out stalled reads after five seconds.
- The API requires JSON, rejects mismatched Origin and cross-site browser requests, validates all three fields, and sends no-store responses. It does not reflect request content in errors.
- Added a bounded limit of 60 requests per minute per running process, with 429 and Retry-After responses. This is shared across visitors on that process; it is not a distributed or per-user limiter.
- Added CSP, anti-framing, MIME-sniffing, referrer, and browser permission headers. Removed X-Powered-By. CSP retains inline script/style support for Next.js and the existing inline styling; it is not a nonce-based strict CSP. Development alone allows eval and WebSocket connections.
- Environment files, private key files, hosting metadata, and contact submissions are excluded from Git. A pattern scan of the working source found no matching credentials; this is not proof that all possible secret formats are absent.
- Kept each navigation view isolated, with inactive views hidden and inert. Internal links resolve only to known DOM targets inside the portfolio. External links and contact actions remain separate.

## Validation

- npm audit: zero known vulnerabilities after lockfile updates.
- npm test: field validation, malformed JSON, oversized and stalled streams, content type, browser origin, persistence, failure responses, and request limits.
- npm run lint and npm run build.
- Browser regression checks cover all 20 left/right navigation directions, isolated scrolling, mobile widths, form draft retention, project dialogs, history, and reduced motion.

## Remaining deployment limitations

- Contact submissions still use private local JSONL storage, as a temporary implementation pending the database. This does not provide reliable durable storage on Vercel. The endpoint returns 503 if saving fails; it must not be presented as a production-ready contact inbox until database or another durable storage integration is added.
- Per-process limits reset on cold starts and do not coordinate between serverless instances. Add hosting/WAF or shared-store limits for distributed spam protection.
- No authentication is needed for this public enquiry form. Origin checks are browser protections, not authentication; a non-browser client can forge headers.
- No customer messages are committed, and regression tests use synthetic data in a temporary directory or mocked browser responses.
