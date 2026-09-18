# Code Style

## Language & Formatting
- TypeScript everywhere, `strict: true`. No `any` — use `unknown` and narrow, or define the real type.
- Prettier + ESLint enforced; don't hand-format against them.
- Prefer explicit return types on exported functions; internal helpers can infer.

## Naming
- Files: `kebab-case.tsx` / `kebab-case.ts` (e.g. `product-card.tsx`, `create-order.ts`)
- Components: `PascalCase`, named export (not default), matching the file's concept — `ProductCard`, not `Card2`
- Props interfaces: `<ComponentName>Props`, colocated with the component unless shared
- Domain functions in `/lib`: verb-first, explicit — `getProductBySlug`, `createOrder`, `markOrderPaid` — not vague names like `handleProduct`
- Booleans: `is`/`has`/`should` prefix (`isLoading`, `hasStock`, `shouldRedirect`)

## Component Conventions
See the `component-builder` skill for the full template. Summary rules:
- Function components only, no class components
- Required props before optional props
- Every component that depends on async data explicitly handles loading / error / empty / success — never silently renders nothing
- Tailwind utility classes only; no inline `style={}` unless a value is genuinely dynamic (e.g. a computed width) and can't be a class
- Reuse tokens from `tailwind.config.ts` (see `design-system.md`) — no one-off hex colors or arbitrary spacing values in component code

## API Route Conventions
See the `api-route-scaffolder` skill for the full template. Summary rules:
- Validate all input with Zod, `.strict()` to reject unknown fields
- Errors always returned as `{ error: { code: string, message: string } }` with an appropriate HTTP status — never a bare string or a raw thrown error
- No business logic inline in a route handler — delegate to `/lib/<domain>`
- No raw SQL from route handlers — go through the Supabase client with typed queries

## Data Fetching
- Server Components / route handlers: Supabase server client (`/lib/supabase/server.ts`)
- Client Components: TanStack Query wrapping Supabase browser client calls — every query defines its own loading/error UI, don't share a single global spinner across unrelated queries
- Query keys: `['<domain>', '<resource>', params]`, e.g. `['products', 'list', { categorySlug }]`

## Forms
- React Hook Form + Zod resolver for every form (checkout, vendor product form)
- Schema lives in `/lib/validation`, shared between the client-side form resolver and the server-side route validation — one definition, not two copies that can drift
- Submit buttons disabled while submitting; show inline field errors, not just a toast

## Error Handling
- Never let a caught error's raw message reach the customer-facing UI — map to a friendly message per PRD §32
- Server-side: `console.error` with enough context to debug (route name, relevant IDs) but never log full payment payloads or secrets — see `security.md`
- Client-side: every data-fetching component has a distinct error UI state, not a blank screen

## Testing Expectations
- Routes/functions touching orders or payments: at minimum a happy-path test and a duplicate/invalid-input test before considered done (see `flutterwave-integration` skill, idempotency section)
- Vendor product CRUD: test that unauthenticated requests are rejected, not just that authenticated ones succeed

## Comments & Docs
- Comment *why*, not *what* — the code should read clearly enough that "what" is redundant
- Any deliberate deviation from a rule file (rare, and only when justified) gets a one-line comment explaining why, so it isn't "corrected" back by a future pass without context
