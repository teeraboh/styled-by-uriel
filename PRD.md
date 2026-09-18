# Styled by Uriel — E-Commerce MVP Build Prompt (Refined)

## 1. Role
You are a senior product designer and full-stack developer building a **production-ready MVP web application** — not a static site or visual prototype. It must have real data flow, real application states, and a working backend.

## 2. Business Context
- **Business:** Styled by Uriel — children's fashion ("Cute. Comfy. Stylish.")
- **Founder:** Natasha Ezinne Amuruonyenaego
- **Location:** Enyimba Market, Aba, Abia State
- **Phone/WhatsApp:** 07039315917
- **Email:** natashaejike99@gmail.com
- **Instagram:** official_styledbyuriel · **TikTok:** styledbyuriel
- **Domain (target):** www.styledbyuriel.com

## 3. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)** | Server-side Flutterwave verification, middleware-protected vendor routes, image optimization for a photo-heavy catalog, good SEO for the public shop |
| Backend/Auth/Storage | **Supabase** (Postgres + Auth + Storage + RLS) | Single provider for DB, vendor auth, and image storage per PRD §13; RLS enforces vendor-only writes without a custom auth layer |
| Payments | **Flutterwave**, server-side verification only | Never trust a client redirect as proof of payment (PRD §19) |
| Styling | **Tailwind CSS** | The brand's palette and component shapes are a small, disciplined token set (warm neutrals, pill buttons, rounded cards) — encode once as tokens (see `design-system.md`) rather than ad hoc CSS per component |
| Component primitives | **shadcn/ui** | Accessible, unstyled base components (buttons, dialogs, dropdowns, form inputs) skinned with the Tailwind tokens — faster than building from scratch, avoids a generic off-the-shelf look |
| Cart state | **Zustand**, persisted to `localStorage`, SSR-guarded | Cart is guest-only (PRD §17) — no server session needed |
| Data fetching | **Supabase JS client + TanStack Query** | Consistent caching, loading, and error states on every product/category fetch, which the PRD requires throughout (§16 product states) |
| Forms | **React Hook Form + Zod** | One shared validation/error/disabled-state pattern across checkout and the vendor product form (§18, §31) |
| Fonts | Serif/script pairing for display moments (hero headline, taglines) + clean sans-serif for nav/prices/body | Matches the reference design's headline treatment — sourced from Google Fonts, finalized against approved brand assets, see `design-system.md` |

### Reusable Components (from approved homepage reference)
Build these once, generically, and reuse them across Home, Shop, and Search rather than rebuilding per page:
- `Header` — logo, nav, search icon, cart icon with item count, primary CTA
- `Hero` — headline, subcopy, CTA, feature-badge row (e.g. Premium Quality / Trendy Styles / Kids Comfort First)
- `ProductCard` — image, name, price, "Shop Now" — the single most-reused component (homepage grid, shop grid, search results, related products)
- `CollectionGrid` — layout wrapper around a set of `ProductCard`s
- `PromoBanner` — split image/text promotional section with a CTA
- `TrustStrip` — icon + label row (e.g. Fast Delivery / Secure Payment / 24/7 Support / Easy Returns)
- `Footer` — nav links, socials, newsletter signup

Building `ProductCard` and the icon/badge rows as strict, reusable components early pays off most once the Shop grid and product detail pages are built.

## 4. Product Philosophy
Build **minimal V1 + a clean foundation for future scale**. Don't build speculative features "because they might be useful later." Core loop:

`Discover → Explore → Understand → Shop → Cart → Checkout → Pay → Confirm → Continue Shopping / WhatsApp`

## 5. User Types

### Customer (guest only — no accounts in V1)
Can: browse, search, filter by category, view product details, select options, manage cart, guest checkout, pay via Flutterwave, receive confirmation, continue shopping, contact vendor via WhatsApp.
**Explicitly excluded:** registration, login, profile, dashboard, saved addresses, wishlist, order history, saved carts.

### Vendor (the only authenticated role)
Can: log in securely (Supabase Auth), access a private dashboard, create/edit/delete products, upload images, manage categories, prices, colours, sizes/variations, and stock/availability.

> **Design constraint:** structure the data model so customer accounts *can* be added later (e.g. an optional `customer_id` on orders) without a rebuild — but do not build that functionality now.

## 6. Site Map

**Public:** Home · Shop · Collections/Categories · Product Details · Cart · Checkout · Order Confirmation · About · Contact
**Vendor (protected):** Login · Dashboard · Products (All/Add/Edit)

Unauthenticated access to any vendor route → redirect to vendor login.

## 7. Homepage
Hierarchy: Hero → Featured/New Products → Shop by Category → Brand value proposition → Selected Collections → About the Brand → Testimonials (**only if client-supplied — never fabricated**) → WhatsApp/Contact CTA → Footer.

## 8. Shop & Search
- Products render from real Supabase data — never hardcoded placeholder catalogs.
- Search matches product name, category, and relevant attributes.
- Empty/no-result states must be explicit and helpful (see §12).

## 9. Data Model

**products**: id, name, description, price, category_id, availability, stock_quantity, created_at, updated_at
**categories**: id, name, slug, created_at
**product_images**: id, product_id, image_url, sort_order, created_at
**product_variations** (only if the product needs them): id, product_id, colour, size, additional_price, stock_quantity, availability
**orders**: id, customer_name, customer_email, customer_phone, delivery_address, total_amount, payment_status, flutterwave_reference, created_at *(leave room for an optional future `customer_id`)*
**order_items**: id, order_id, product_id, product_name_snapshot, quantity, selected_colour, selected_size, unit_price, subtotal

Simplify fields that aren't required by actual product data — don't add complexity preemptively.

## 10. Vendor Product Management
Full CRUD with:
- Required validation on create/edit (name, price, category, images, and variations where applicable)
- Confirmation step before delete
- Images uploaded to Supabase Storage; store the resulting URL against the product
- RLS enforced so only authenticated vendor(s) can write

## 11. Commerce Flow

**Cart (guest, session-persisted where practical):** add/remove items, adjust quantity (no invalid quantities), show selected options/unit price/subtotal/total, empty-cart state, continue shopping / proceed to checkout.

**Checkout (guest only):** collect only what's needed to fulfill the order — name, phone, email, delivery address. No account creation prompt.

**Payment (Flutterwave):**
`Checkout → Review Order → Flutterwave Payment → Payment Result → Server-side Verification → Confirmation`
- Never treat payment as successful just because the customer was redirected back — verify via Flutterwave's API server-side.
- No API keys, secrets, or credentials in client code — server-side/env config only.

**Confirmation screen:** payment/order status, order reference, purchase summary, and two actions — **Continue Shopping** (primary) and **Chat with us on WhatsApp** (secondary, using the confirmed vendor number).

## 12. Required UI/Product States
Available · Out of stock (only when stock data confirms it) · Missing info (don't invent it — flag it) · Product not found · Empty category · No search results (with a path back to browsing) · Loading · Success · Error · Disabled · Processing.

## 13. Design Direction
- **Feel:** premium, warm, modern, clean, child-friendly but fashion-forward — not a toy-store aesthetic.
- **Colour:** warm neutral base (cream, beige, warm white, brown, tan) with soft accents, finalized from approved brand assets.
- **Type:** distinctive serif or fashion-oriented typeface for headlines; clean readable sans-serif for body/UI.
- **Responsive:** must work fully on mobile, tablet, laptop, desktop — mobile is high-priority (traffic likely arrives via Instagram/TikTok/WhatsApp).
- **Motion:** only where it aids understanding — no decorative/parallax/excess animation.

## 14. Engineering Standards
- **Forms:** clear labels, validation, helpful errors, loading/success/disabled states.
- **Errors:** fail gracefully everywhere (Supabase down, image upload failure, payment failure, invalid checkout fields, unauthorized vendor access) — never expose raw technical errors, API keys, or DB errors to customers.
- **Accessibility:** semantic HTML, keyboard navigation, visible focus states, alt text, accessible labels/errors, sufficient contrast.
- **Performance:** optimized/lazy-loaded images, efficient queries, minimal unnecessary JS.
- **Security:** Supabase Auth + RLS, protected vendor routes, no exposed secrets, server-side payment verification, input validation, proper authorization checks.

## 15. Content Integrity Rule (governs everything above)
Only use business/product information, prices, images, and copy explicitly supplied by the client or approved assets. **Never invent** product data, prices, testimonials, reviews, stock levels, policies, discounts, or credentials. If something is missing, flag it or use an explicit placeholder/empty state — never guess. If sources conflict, flag the conflict rather than silently picking one.

## 16. Out of Scope for V1
Customer accounts/login/dashboard, wishlist, reviews, loyalty system, analytics, recommendation engine, AI shopping assistant, CRM, marketing automation, subscriptions, multi-vendor marketplace, order-history dashboard, inventory forecasting. (Candidates for a documented V2, not this build.)

## 17. Acceptance Criteria
- Brand identity ("Cute. Comfy. Stylish.") and premium children's-fashion feel are evident.
- Full guest journey works end-to-end: browse → search → product detail → cart → guest checkout → Flutterwave payment → verified confirmation → continue shopping / WhatsApp.
- Vendor can log in, and only a logged-in vendor can create/edit/delete products and upload images; dashboard is inaccessible to anyone else.
- All product/category/image data lives in Supabase with RLS; no secrets exposed client-side.
- Responsive, with loading/error/empty states throughout; forms validate correctly.
- No invented business or product information anywhere in the app.

## 18. Guiding Principle
Build less, but build it properly: **clarity + simplicity + trust + functionality + scalability.** Don't over-engineer the MVP or pre-build V2 features — build a foundation that can grow into them later.
