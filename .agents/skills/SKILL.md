---
name: component-builder
description: Use this skill whenever creating a new React component for Styled by Uriel — UI primitives, product/cart/checkout/vendor components, or page-level compositions. Ensures every component follows the project's naming, structure, styling, and state-handling conventions instead of being scaffolded ad hoc. Trigger on requests like "build a component for...", "create a ProductCard", "add a new UI element for...".
---

# Component Builder

Use this skill to scaffold any new React component so it's consistent with `.agents/rules/design-system.md` and `.agents/rules/code-style.md`. Read both before generating the component if this is the first one being built in a session.

## Step 1 — Decide Where It Lives

- Generic, reusable primitive (Button, Input, Card, Badge, Spinner) → `/components/ui/`
- Product-domain component (ProductCard, ProductGallery, VariationSelector) → `/components/product/`
- Cart-domain component (CartDrawer, CartLineItem, CartSummary) → `/components/cart/`
- Checkout-domain component (CheckoutForm, OrderSummary) → `/components/checkout/`
- Vendor-only component (ProductForm, ProductTable, ImageUploader) → `/components/vendor/`
- Site-wide layout piece (Header, Footer, TrustStrip, PromoBanner) → `/components/layout/`
- Page-specific composition used by exactly one route → colocate under that route's folder, don't force it into a shared folder

## Step 2 — File & Naming Conventions

- File name: `kebab-case.tsx` (e.g. `product-card.tsx`)
- Component name: `PascalCase`, matching the concept it represents (e.g. `ProductCard`)
- Named export, not default export
- Props interface named `<ComponentName>Props`, defined in the same file unless shared elsewhere

## Step 3 — Component Template

```tsx
import type { FC } from "react";

interface ProductCardProps {
  // required props first, optional last
  name: string;
  price: number;
  imageUrl: string;
  href: string;
  isLoading?: boolean;
}

export const ProductCard: FC<ProductCardProps> = ({
  name,
  price,
  imageUrl,
  href,
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className="animate-pulse rounded-xl bg-[--color-border] aspect-square" />;
  }

  return (
    <a href={href} className="block rounded-xl border border-[--color-border] bg-[--color-surface] overflow-hidden">
      {/* image, name, price, CTA — per design-system.md card spec */}
    </a>
  );
};
```

## Step 4 — Required States

Every component that fetches or depends on async data must handle, explicitly:
- **Loading** — prefer a skeleton matching the component's real layout over a generic spinner, especially for grids (`ProductGrid`, `ProductTable`)
- **Error** — a clear, non-technical message; never let the component silently render nothing
- **Empty** — zero-items case (empty cart, empty category, no search results) with a path forward, per PRD §16
- **Success** — the normal populated state

## Step 5 — Styling Rules

- Tailwind utility classes only — no inline `style={}` unless a value is truly dynamic and can't be expressed as a class
- Mobile-first: base classes target small screens, use `sm:`/`md:`/`lg:` to scale up
- Use the color/spacing/type tokens defined in `design-system.md` and `tailwind.config.ts` — no one-off hex colors or arbitrary spacing values
- Interactive elements (buttons, add-to-cart, quantity steppers) meet the ~44px comfortable tap-target minimum

## Step 6 — Accessibility Checklist

- Interactive elements are real `<button>`/`<a>` tags, not `<div onClick>`
- Product/lifestyle images have meaningful `alt` text — never empty or filename-based
- Sufficient color contrast using the palette in `design-system.md` — don't invent low-contrast variants for "subtlety"
- Focus states are visible, not suppressed

## Step 7 — Before Finishing

- Does this duplicate an existing component in `/components/ui` or the relevant domain folder? If so, extend/reuse instead of creating a near-duplicate.
- If this is on or near the checkout or payment path, double-check it doesn't pull in unnecessary dependencies or block on non-critical requests.
- Export any TypeScript types other components will need from `/types`, matching the Supabase schema shape.
- If the component displays product, price, or business content, confirm it renders exactly what's in Supabase / approved assets — no fallback placeholder text dressed up as real content (see `AGENT.md` rule 1).
