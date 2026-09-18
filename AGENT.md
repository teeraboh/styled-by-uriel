# AGENT.md — Styled by Uriel

This file is the entry point for any coding agent (or developer) working in this repository. Read it first, every session.

## What This Project Is

A production-ready MVP e-commerce web app for **Styled by Uriel**, a children's fashion brand ("Cute. Comfy. Stylish."). Guests browse and buy without accounts; a single authenticated vendor manages the catalog. Full requirements live in `PRD.md` — that document is the source of truth for scope. This file governs *how* to work, not *what* to build.

## Before You Touch Code

Read, in order:
1. `.agents/rules/architecture.md` — folder structure, service boundaries, data flow
2. `.agents/rules/design-system.md` — colors, type, spacing, component look-and-feel
3. `.agents/rules/code-style.md` — naming, formatting, validation, error shape
4. `.agents/rules/security.md` — auth, RLS, secrets, payment-verification rules

These four are the **authoritative rules**. Skills (below) are the **authoritative implementation guides** for specific recurring tasks — they assume you've already read the rules.

## Skills Available in This Repo

| Skill | Use when |
|---|---|
| `component-builder` | Creating any new React component |
| `api-route-scaffolder` | Creating any new Next.js API route |
| `db-migration-runner` | Adding or changing a Supabase table, column, or RLS policy |
| `flutterwave-integration` | Touching payment initiation, verification, or webhooks |

Trigger the matching skill automatically when a task fits it — don't scaffold these by hand once a skill exists for the pattern.

## Non-Negotiable Rules (apply everywhere, no exceptions)

1. **Never invent data.** No fake products, prices, testimonials, stock numbers, policies, or credentials. If information is missing, use an explicit empty/placeholder state or flag it — do not guess. (PRD §36–38)
2. **No customer accounts in V1.** Don't add customer registration, login, profile, order history, or saved carts, even if it seems convenient for a feature you're building. The data model may *allow* for it later (e.g. optional `customer_id` on orders) but nothing customer-account-shaped gets built now.
3. **Guest checkout only, guest cart only.** Cart lives client-side (Zustand + `localStorage`); no server session for buyers.
4. **Payment success is server-verified, always.** A client-side redirect back from Flutterwave is never sufficient proof of payment — see `flutterwave-integration` skill and `security.md`.
5. **Vendor routes are protected by default.** Any route under the vendor surface must redirect unauthenticated users to login — verify this explicitly for every new vendor route, don't assume middleware alone covers a new edge case.
6. **No secrets in client code.** Flutterwave secret key, webhook hash, Supabase service-role key — server-side/env only, never in a client component or exposed API response.
7. **Every async UI state is handled.** Loading, error, empty, and success — not just the happy path. This is a hard requirement from the PRD, not a nice-to-have.
8. **Don't build ahead of scope.** No analytics, recommendation engines, loyalty systems, multi-vendor support, etc. If a task seems to require one of these, stop and flag it rather than building it — see PRD §41.

## When Something Is Ambiguous

- If the PRD and a rule file conflict, the PRD wins on *scope*, the rule file wins on *implementation detail*. Flag the conflict rather than silently picking one.
- If a design detail isn't covered in `design-system.md` (an exact color, spacing value, icon style), infer conservatively from the existing homepage reference and flag the assumption — don't introduce a new one-off style.
- If unsure whether something is in scope, check PRD §40–41 (in/out of scope) before building it.

## Definition of Done (any feature)

- Matches PRD scope — nothing more, nothing less
- Follows `code-style.md` and `design-system.md`
- Handles loading/error/empty/success states
- No invented content anywhere in the change
- No secrets or credentials introduced into client-reachable code
- If it touches auth, payments, or the DB schema — the relevant skill's checklist has been followed exactly
