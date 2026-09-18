# Architecture

## Stack Summary
Next.js (App Router, TypeScript) · Supabase (Postgres, Auth, Storage, RLS) · Flutterwave · Tailwind CSS + shadcn/ui · Zustand (cart) · TanStack Query · React Hook Form + Zod.

## Folder Structure

```
/app
  /(public)/              # customer-facing route group — no auth
    page.tsx              # home
    /shop/page.tsx
    /shop/[category]/page.tsx
    /product/[slug]/page.tsx
    /cart/page.tsx
    /checkout/page.tsx
    /checkout/confirmation/page.tsx
    /about/page.tsx
    /contact/page.tsx
  /(vendor)/               # vendor route group — protected by middleware
    /login/page.tsx
    /dashboard/page.tsx
    /dashboard/products/page.tsx
    /dashboard/products/new/page.tsx
    /dashboard/products/[id]/edit/page.tsx
  /api
    /products/...
    /categories/...
    /orders/...
    /payments/initiate/route.ts
    /payments/webhook/route.ts
    /payments/verify/route.ts

/components
  /ui/                    # shadcn primitives + generic pieces (Button, Card, Badge, Spinner)
  /product/               # ProductCard, ProductGrid, ProductGallery, VariationSelector
  /cart/                  # CartDrawer, CartLineItem, CartSummary
  /checkout/              # CheckoutForm, OrderSummary
  /vendor/                # ProductForm, ProductTable, ImageUploader
  /layout/                # Header, Footer, TrustStrip, PromoBanner

/lib
  /supabase/              # client.ts (browser), server.ts (server client), admin.ts (service-role, server-only)
  /auth/                  # requireVendor(), session helpers
  /products/              # domain functions: getProducts, getProductBySlug, createProduct, etc.
  /orders/                # domain functions: createOrder, markOrderPaid, getOrderByRef
  /payments/              # Flutterwave client wrapper, verification logic
  /validation/            # shared Zod schemas
  env.ts                  # typed, validated env var access — the only place process.env is read directly

/store
  cart.ts                 # Zustand store

/types                    # shared TypeScript types (mirrors DB schema)

/supabase
  /migrations/            # SQL migrations — see db-migration-runner skill
```

## Service Boundaries (domains)

Four domains: **auth**, **products** (incl. categories, images, variations), **orders** (incl. cart→order conversion), **payments**.

Rule: a route handler or component may call into its *own* domain's `/lib` functions freely, and may call into another domain's `/lib` functions, but must never query another domain's Supabase tables directly. This keeps RLS assumptions and business rules in one place per domain.

Example: the checkout API route creates an order (`/lib/orders`), which internally reads product prices (`/lib/products`) to snapshot them — the route itself never touches the `products` table directly.

## Data Flow

**Public product read:** Server Component or TanStack Query on the client → `/lib/products` → Supabase (anon key, RLS allows public `select` on published products/categories/images only).

**Guest cart:** entirely client-side (Zustand + `localStorage`). No `carts` table in V1. Cart contents are only sent to the server once, at checkout, as the order payload.

**Checkout → payment:** client submits checkout form → `/api/orders` creates a `pending` order server-side (price snapshot from DB, not from client-submitted prices) → `/api/payments/initiate` starts the Flutterwave transaction → buyer redirected to Flutterwave → Flutterwave redirects back **and** sends a webhook → `/api/payments/webhook` and/or `/api/payments/verify` independently confirm the transaction against Flutterwave's API before marking the order paid. See `flutterwave-integration` skill for the full sequence.

**Vendor writes:** vendor dashboard → `/api/products/...` (authenticated route, `requireVendor()`) → `/lib/products` → Supabase (RLS requires an authenticated vendor role for insert/update/delete).

## Rendering Strategy

- Home, Shop, Product Detail: Server Components fetching directly via `/lib/products`, revalidated on a short interval or on-demand when the vendor publishes a change — avoids a stale catalog without needing client-side fetching for SEO-relevant content.
- Cart, Checkout, Vendor Dashboard: Client Components (interactive, not SEO-relevant).
- API routes are the only place that ever touches the Supabase service-role key or Flutterwave secret key.

## Future Customer-Account Path (do not build now)

`orders.customer_id` is left nullable and unused in V1. When customer accounts are introduced later, this becomes a foreign key to a new `customers`/`auth.users`-linked table, and existing guest orders remain valid with `customer_id = null`. No other schema change should be required to support it — if a V1 change would make that harder later, flag it rather than proceeding.
