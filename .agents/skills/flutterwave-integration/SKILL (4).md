---
name: flutterwave-integration
description: Use this skill whenever implementing, modifying, or debugging anything related to payment collection, checkout, transaction verification, or payment webhooks in Styled by Uriel. Covers initiating a Flutterwave payment, verifying transactions server-side, and handling webhooks securely and idempotently. Do not implement any other payment gateway — Flutterwave is the sole payment provider for this product (PRD §19).
---

# Flutterwave Integration

Styled by Uriel collects payment through Flutterwave for guest checkout only — there is no stored payment method, subscription, or saved card flow. This skill defines the required flow for initiating payments, verifying them, and handling webhooks. Follow `security.md` and `architecture.md` alongside this skill — this is the authoritative implementation guide, those are the authoritative rules.

## Overview of the Flow

1. Buyer completes the guest checkout form (`CheckoutForm`) and clicks "Pay Now"
2. `/api/orders/create` creates an `orders` row (`payment_status: pending`) with a unique `flutterwave_reference` (`tx_ref`), using **server-side product price snapshots** — never client-submitted prices
3. `/api/payments/initiate` sends the buyer to Flutterwave checkout (hosted payment page) with that `tx_ref`, the order's server-computed total, and buyer contact details
4. Buyer completes payment on Flutterwave's side (this app never touches card data directly)
5. Flutterwave redirects the buyer back to `/checkout/confirmation` **and** sends an asynchronous webhook to `/api/payments/webhook` — both matter, but the webhook is the source of truth
6. The app verifies the webhook signature, then independently calls Flutterwave's Verify Transaction endpoint via `/api/payments/verify`
7. On confirmed success: set `orders.payment_status = paid`, the confirmation page reflects it
8. On failure/mismatch: set `orders.payment_status = failed`, let the buyer retry from checkout

## Step 1 — Initiating a Payment

Use Flutterwave's Standard checkout (hosted redirect) unless there's a specific reason to use the inline widget — the hosted flow keeps more of the payment surface off this app's servers and simplifies PCI scope.

Required fields when initiating:
- `tx_ref`: this app's `flutterwave_reference` for the order (must be unique — generate with a collision-resistant method, e.g. the order's `id` or a prefixed UUID)
- `amount`: must equal `orders.total_amount` exactly — the snapshot taken at order creation, not a live re-lookup of product prices
- `currency`: `NGN`
- `redirect_url`: the confirmation route (e.g. `/checkout/confirmation?order=<id>`) — this route only *displays* current order status, it never marks an order paid itself
- `customer`: buyer name/email/phone from the checkout form

Never initiate a payment with an amount sourced from client-submitted data — always read `orders.total_amount` server-side, computed at order-creation time from the products table.

## Step 2 — Verifying a Transaction

Do not trust the redirect or the webhook payload's stated status on its own. After receiving either signal:

1. Call Flutterwave's Verify Transaction endpoint using the transaction ID
2. Confirm the returned `status` is `successful`
3. Confirm the returned `amount` and `currency` match `orders.total_amount` and `NGN` exactly
4. Confirm the returned `tx_ref` matches an existing `pending` order — if the order is already `paid`, treat this as a duplicate and do not reprocess
5. Only after all four checks pass, set `orders.payment_status = paid`

## Step 3 — Webhook Handling

See `resources/webhook-handler.ts` for a reference implementation. Key requirements for `/api/payments/webhook`:

- Verify the `verif-hash` header against the secret hash configured in the Flutterwave dashboard (stored via `/lib/env.ts`, server-only) before treating the body as trusted. If it doesn't match, reject without processing further.
- Treat the webhook as a *trigger to verify*, not as verification itself — always run Step 2's verification logic before mutating order state, even though the webhook body includes a stated status.
- Make the handler idempotent: if `orders.payment_status` is already `paid` for the given `tx_ref`, return success without reprocessing. Flutterwave (like most gateways) can and will send duplicate webhook deliveries.
- Wrap the handler in try/catch; log failures with the `tx_ref` and error, but never log the full webhook payload (per `security.md`, no sensitive payment data in logs).
- Respond quickly — do any non-essential follow-up work (e.g. notifying the vendor) after acknowledging the webhook, not before.

## Environment Variables Required

```
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_WEBHOOK_HASH=
```

Only accessed via `/lib/env.ts` and only from `/lib/payments` — never imported into a Client Component. Test and live values must be clearly separated per environment (see `security.md`).

## Common Mistakes to Avoid

- ❌ Marking an order paid directly from the client-side redirect callback without server-side verification
- ❌ Trusting the amount/currency in the webhook payload without cross-checking against the stored order's server-computed total
- ❌ Missing idempotency checks, resulting in duplicate fulfillment or notifications on repeated webhook delivery
- ❌ Logging full webhook payloads or Flutterwave API responses that may contain sensitive buyer data
- ❌ Generating `tx_ref` values that aren't guaranteed unique (e.g. timestamp-only) — collisions break duplicate-transaction protection
- ❌ Implementing a second payment gateway "as a fallback" — Flutterwave is the sole provider per the PRD; flag it instead of adding one
