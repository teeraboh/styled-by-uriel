---
name: api-route-scaffolder
description: Use this skill whenever creating a new API route or route handler in Styled by Uriel (e.g. under /app/api). Ensures every route follows validation, error-shape, auth, and service-boundary conventions consistently. Trigger on requests like "add an endpoint for...", "create an API route to...", "build the backend for...".
---

# API Route Scaffolder

Use this skill to scaffold any new Next.js route handler so it's consistent with `.agents/rules/architecture.md`, `.agents/rules/code-style.md`, and `.agents/rules/security.md`. Read all three before generating the route if this is the first route being built in a session.

## Step 1 — Confirm the Route's Owner Domain

Per `architecture.md`'s service boundaries, confirm which domain this route belongs to — **auth**, **products**, **orders**, or **payments** — and place it under the matching `/app/api/<domain>/` folder. A route should only read/write the data its owning domain is responsible for; delegate to another domain's `/lib` functions instead of reaching into another domain's Supabase tables directly.

## Step 2 — File Location & Naming

- Path: `/app/api/<domain>/<action>/route.ts` (e.g. `/app/api/orders/create/route.ts`, `/app/api/payments/webhook/route.ts`)
- Export named HTTP method functions per Next.js convention: `GET`, `POST`, `PATCH`, `DELETE` — no default export, the framework requires these specific named exports

## Step 3 — Route Template

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireVendor } from "@/lib/auth"; // omit only for genuinely public routes (e.g. public product reads, checkout order creation)
import { createServerSupabaseClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  // define expected shape explicitly — reject unknown fields
}).strict();

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check (skip only for intentionally public routes)
    const vendor = await requireVendor(req);

    // 2. Validate input
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "invalid_input", message: "Invalid request body" } },
        { status: 400 }
      );
    }

    // 3. Delegate to a /lib/<domain> function — no business logic inline here
    const supabase = createServerSupabaseClient();
    const result = await someDomainFunction(supabase, vendor.id, parsed.data);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error in <route name>", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
```

## Step 4 — Required Elements Checklist

- [ ] Input validated with Zod (`.strict()` to reject unexpected fields) — see `code-style.md`
- [ ] Auth check present unless the route is intentionally public (e.g. reading a product by slug, submitting a guest order)
- [ ] Errors returned in the standard `{ error: { code, message } }` shape
- [ ] Uses the Supabase client with RLS-aware queries — no bypassing RLS with the service-role key unless the route genuinely requires it (e.g. the payment webhook), and if so, that's documented inline
- [ ] No business logic inline — delegate to `/lib/<domain>`
- [ ] No secrets referenced directly — via `/lib/env.ts` only, and only from the module that owns them (e.g. only `/lib/payments` touches Flutterwave keys)
- [ ] If this route mutates order/payment state, confirm idempotency — see `security.md` and the `flutterwave-integration` skill

## Step 5 — Payment-Adjacent Routes

If the route creates an order, initiates a payment, or receives a webhook, do not implement Flutterwave logic here directly — use the `flutterwave-integration` skill and call into `/lib/payments`. This route should only orchestrate: validate input, call the payments module, return a response.

## Step 6 — Vendor Product Routes

If the route creates, edits, or deletes a product/category/image, confirm `requireVendor()` runs before any write, and that the underlying Supabase RLS policy also restricts the operation to authenticated vendors (defense in depth — the route check and the RLS policy are both required, neither replaces the other).

## Step 7 — Testing

Per `code-style.md`, routes touching orders/payments/vendor writes need at minimum a happy-path test and a duplicate/invalid-input/unauthenticated test before considered done.
