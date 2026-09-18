# Design System

Source: the Stitch "Style-by-uriel" project (Warm Boutique Editorial theme). These values are extracted from the approved Stitch design system and match the generated screen designs exactly. **Confirm against official brand assets (logo file, brand guide) before treating any value as final**, per the content-integrity rule in `AGENT.md`.

## Color Tokens

Warm neutral palette — cream/beige base, dark brown text, cocoa/tan accents. Defined as CSS variables via Tailwind `@theme`, never as raw hex inline in components.

```css
@theme {
  /* Brand palette */
  --color-brand-cream: #FBF8F5;          /* page background */
  --color-brand-ivory: #F5EFEB;          /* card / section background */
  --color-brand-sand: #EFE7DE;           /* subtle dividers, softer bg */
  --color-brand-almond: #EAE0D5;         /* badge backgrounds, surface layer */
  --color-brand-beige: #DFCBBF;          /* text selection, muted accents */
  --color-brand-caramel: #C9A882;        /* secondary buttons, card action links */
  --color-brand-warm-brown: #8C6A53;     /* primary CTA, buttons, links */
  --color-brand-warm-brown-dark: #72533F;/* button hover/active state */
  --color-brand-dark-brown: #3A2B22;     /* primary text, near-black */
  --color-brand-charcoal: #221C19;       /* deep emphasis text */

  /* Material-style surface system (from Stitch) */
  --color-surface: #FFF8F6;
  --color-surface-dim: #E8D7D0;
  --color-surface-container-lowest: #FFFFFF;
  --color-surface-container-low: #FFF1EB;
  --color-surface-container: #FCEAE3;
  --color-surface-container-high: #F6E5DE;
  --color-surface-container-highest: #F0DFD8;
  --color-on-surface: #221A16;
  --color-on-surface-variant: #50453E;
  --color-outline: #82746D;
  --color-outline-variant: #D3C3BA;

  /* Error */
  --color-error: #BA1A1A;
  --color-error-container: #FFDAD6;
}
```

Do not add saturated or "toy store" colors (bright red/blue/green) — every accent stays inside this warm neutral family.

## Typography

- **Display / script accent** (hero flourishes like "Big Stories", "Fashion for brighter tomorrows ♡"): **Caveat** (script/cursive), used sparingly — one or two words per usage, never full paragraphs.
- **Headlines** (H1–H3, hero headlines, section titles): **Playfair Display** (serif), weight 600, letter-spaced for section labels.
- **Body / UI** (nav, prices, buttons, form labels, descriptions): **Plus Jakarta Sans** (sans-serif).

Loaded via `next/font/google` in `app/layout.tsx` for performance.

Type scale (from Stitch design system):
```
display-hero:        Playfair Display, 60px, weight 600, line-height 68px, letter-spacing -0.02em
display-hero-mobile: Playfair Display, 38px, weight 600, line-height 44px, letter-spacing -0.01em
headline-lg:         Playfair Display, 34px, weight 600, line-height 42px, letter-spacing 0.01em
headline-lg-mobile:  Playfair Display, 26px, weight 600, line-height 32px, letter-spacing 0.01em
headline-md:         Plus Jakarta Sans, 22px, weight 700, line-height 28px, letter-spacing 0.08em
headline-sm:         Plus Jakarta Sans, 18px, weight 700, line-height 24px, letter-spacing 0.04em
title-price:         Plus Jakarta Sans, 22px, weight 800, line-height 26px, letter-spacing -0.01em
body-lg:             Plus Jakarta Sans, 16px, weight 400, line-height 24px
body-md:             Plus Jakarta Sans, 14px, weight 400, line-height 20px
body-sm:             Plus Jakarta Sans, 12px, weight 400, line-height 18px
label-caps:          Plus Jakarta Sans, 11px, weight 700, line-height 14px, letter-spacing 0.15em
label-md:            Plus Jakarta Sans, 13px, weight 600, line-height 16px, letter-spacing 0.02em
```

## Spacing & Layout
- Spacing scale from Stitch: `space-xs: 0.25rem`, `space-sm: 0.5rem`, `space-md: 1rem`, `space-lg: 1.5rem`, `space-xl: 2.5rem`
- Gutter: `1.5rem` desktop, `0.75rem` mobile
- Margin: `3rem` desktop, `1rem` mobile
- Max content width ~1280px, centered, with consistent horizontal gutter
- Generous whitespace between sections — avoid cramming content edge-to-edge

## Components

**Buttons** — pill/rounded shape (`rounded` to `rounded-md`), solid `--color-brand-warm-brown` fill, white text, uppercase or title-case label with letter spacing. Hover → `--color-brand-warm-brown-dark`. Minimum comfortable tap target (~44px height) on all breakpoints. Forward arrow (`→`) on browse/hero CTAs.

**Secondary Buttons** — caramel beige background (`--color-brand-caramel`), deep brown text, providing soft warmth for product card purchase triggers.

**Ghost / Outlined Buttons** — Transparent fill with `1px` stroke in `--color-brand-warm-brown` or `--color-brand-dark-brown`, paired with high-contrast text.

**Cards** (`ProductCard` etc.) — warm white surface background, subtle border (`--color-outline-variant` or `rgba(39, 30, 26, 0.08)`) or soft warm-tinted shadow (`--shadow-card`), rounded corners, consistent internal padding.

**Icons** — simple outline style (delivery truck, shield/security, headset, box — as in the trust strip), single-color using text or accent color, never filled/glyph-heavy icons.

**Badges / feature rows** (e.g. "Premium Quality," "Trendy Styles") — icon + short label pairing, no background chip unless the reference shows one.

**Product Cards** — Warm container surface with seamless neutral padding surrounding photography. Clear title hierarchy: uppercase centered style name (`body-md` bold) followed by prominent pricing in Nigerian Naira (₦, `title-price` weight). Compact secondary button beneath the price.

**Trust Strip** — Trust indicators (Fast Delivery Across Nigeria, Secure Payment, 24/7 Support, Easy Returns) use clean, delicate 1.5px line-art stroke icons with two-tier descriptive microcopy.

## Imagery
- Product photography is the source of truth (PRD §15) — never generate or substitute fictional product photos.
- Stitch-generated placeholder images are used as temporary dev placeholders until real product photos are provided. These are clearly marked and will be replaced.
- Hero/lifestyle photography should keep the warm, soft-lit tone.
- All images: meaningful `alt` text, responsive sizing via `next/image`, lazy-loaded below the fold.

## Motion
- Only functional transitions: hover states, button feedback, loading skeletons, modal/drawer open-close.
- `hover-lift` utility: `transform: translateY(-4px)` with cubic-bezier easing on product cards.
- No parallax, no scroll-triggered decorative animation, no auto-playing carousels that can't be paused.

## Responsive Breakpoints
Use Tailwind's defaults (`sm`, `md`, `lg`, `xl`) mobile-first. Priority order for testing any new UI: mobile → tablet → desktop, since PRD §13 flags mobile as the primary entry point (Instagram/TikTok/WhatsApp traffic).

## Elevation & Depth
Visual hierarchy relies on soft tonal layer stacking rather than dramatic shadows:
- **Surface Tiers**: Elements float over `--color-brand-cream` using nested surfaces (`--color-brand-ivory`, `--color-brand-almond`).
- **Ambient Shadow**: `box-shadow: 0 12px 32px -4px rgba(39, 30, 26, 0.06), 0 4px 12px -2px rgba(39, 30, 26, 0.03);`
- **Hairline Borders**: `rgba(39, 30, 26, 0.08)` for card borders and structural dividers.
