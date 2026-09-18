# Security

## Authentication
- Only the vendor role authenticates, via **Supabase Auth** (email + password). There is no customer authentication in V1 — do not add a login/session concept for buyers.
- Vendor sessions are managed via Supabase's server-side session helpers (cookie-based), checked in middleware for every route under the vendor route group, and again inside each vendor API route via `requireVendor()` — never rely on the client to self-report as authenticated.
- Unauthenticated access to any vendor route or vendor API endpoint → redirect (page) or `401` (API), never a silent no-op or partial render.

## Row Level Security (Supabase)
RLS must be **enabled on every table**, no exceptions, including ones that feel low-risk. Baseline policy shape:

| Table | Public (anon) | Vendor (authenticated) |
|---|---|---|
| `products`, `categories`, `product_images`, `product_variations` | `SELECT` only, and only rows meant to be publicly visible (e.g. `availability = true` where relevant) | Full `SELECT/INSERT/UPDATE/DELETE` |
| `orders`, `order_items` | `INSERT` only (via the checkout API route, using the anon key is acceptable *only if* combined with strict server-side validation — prefer routing all order writes through a server route using the service-role key so anon clients never write directly) | Full `SELECT` (for future order-visibility needs); no general public `SELECT` on orders (contains customer PII) |

Write the actual policies in the migration that creates each table (see `db-migration-runner` skill) — don't leave a table with default-deny-everything or default-allow-everything and "fix it later."

## Secrets & Environment Variables
- All access to `process.env` goes through `/lib/env.ts`, which validates presence/shape at startup — no scattered `process.env.X` reads through the codebase.
- Never reference the Supabase **service-role key** or the Flutterwave **secret key** / **webhook hash** from any file that could run in the browser. If a component is a Client Component, it must not import a module that touches these.
- `.env.local` (and any real secrets) never committed — only `.env.example` with placeholder values.
- Separate keys per environment (dev/staging/production) — a dev deployment must never point at live Flutterwave or a shared production Supabase project.

## Payment Security
See the `flutterwave-integration` skill for the full flow. Non-negotiables:
- Order amount is always read from the server-side price snapshot taken at order creation — never trust a client-submitted amount.
- Payment success is only recorded after independent server-side verification against Flutterwave's API — the redirect callback and the webhook are both *signals to verify*, neither is proof on its own.
- Webhook requests are only trusted after validating the signature/hash header against the secret configured server-side.
- Webhook handling is idempotent — reprocessing a duplicate delivery must not double-charge, double-fulfill, or create duplicate order records.

## Input Validation
- Every API route validates its input with Zod (`.strict()`), rejecting unexpected fields rather than silently ignoring them.
- Validate on both the server (authoritative) and client (UX) — client-side validation is never a substitute for server-side validation.

## Error Handling & Information Disclosure
- Customer-facing error messages are generic and non-technical (PRD §32) — never surface stack traces, raw Supabase/Postgres errors, API keys, or internal identifiers to the browser.
- Logs may contain enough detail to debug (route, relevant non-sensitive IDs) but never full payment payloads, card-adjacent data, or secrets.

## File Uploads (Vendor Product Images)
- Uploads go through Supabase Storage from an authenticated vendor session only — never accept a direct unauthenticated upload path.
- Validate file type/size server-side before accepting, don't rely solely on client-side `accept` attributes.
- Store only the resulting URL/reference against the product — never store raw file bytes in the database.

## Dependency & Config Hygiene
- Keep dependencies current; don't pin to versions with known critical CVEs.
- No `dangerouslySetInnerHTML` or equivalent without a specific, documented reason and sanitization — default assumption is it's not needed anywhere in this app.
