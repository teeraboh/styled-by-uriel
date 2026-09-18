// /app/api/payments/webhook/route.ts — reference implementation
//
// This file is referenced by the flutterwave-integration skill. It shows the
// required shape for the webhook route: signature check → idempotency check
// → independent server-side verification → order update. Adapt the imports
// below to the actual /lib modules in this repo before using.
//
// Do not copy this file in unmodified — confirm table/column names against
// the current schema (see db-migration-runner skill output) and the actual
// signatures of createServiceRoleSupabaseClient / verifyFlutterwaveTransaction.

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave";
import { env } from "@/lib/env";

interface FlutterwaveWebhookPayload {
  event: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      email: string;
      name?: string;
      phone_number?: string;
    };
  };
}

export async function POST(req: NextRequest) {
  // 1. Verify the webhook signature BEFORE trusting anything in the body.
  const signature = req.headers.get("verif-hash");

  if (!signature || signature !== env.FLUTTERWAVE_WEBHOOK_HASH) {
    console.error("flutterwave webhook: signature mismatch, rejecting");
    return NextResponse.json(
      { error: { code: "invalid_signature", message: "Invalid signature" } },
      { status: 401 }
    );
  }

  let payload: FlutterwaveWebhookPayload;
  try {
    payload = await req.json();
  } catch (err) {
    console.error("flutterwave webhook: failed to parse body", err);
    return NextResponse.json(
      { error: { code: "invalid_payload", message: "Invalid payload" } },
      { status: 400 }
    );
  }

  const { tx_ref, id: transactionId } = payload.data ?? {};

  if (!tx_ref || !transactionId) {
    console.error("flutterwave webhook: missing tx_ref or transaction id");
    return NextResponse.json(
      { error: { code: "invalid_payload", message: "Missing required fields" } },
      { status: 400 }
    );
  }

  // Service-role client is used here ONLY because this route authenticates
  // via the webhook signature, not a user/vendor session. Never reach for
  // the service-role client in a route that has a normal session available
  // — see security.md.
  const supabase = createServiceRoleSupabaseClient();

  try {
    // 2. Idempotency check — look up the order before doing anything else.
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, payment_status, total_amount")
      .eq("flutterwave_reference", tx_ref)
      .single();

    if (fetchError || !order) {
      console.error("flutterwave webhook: no matching order for tx_ref", tx_ref);
      // Acknowledge with 200 so Flutterwave doesn't retry indefinitely for
      // a tx_ref that will never resolve to a real order (e.g. stale/test data).
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (order.payment_status === "paid") {
      // Already processed — this is a duplicate delivery. Do not reprocess.
      return NextResponse.json({ received: true, alreadyProcessed: true }, { status: 200 });
    }

    // 3. Independently verify the transaction with Flutterwave's API.
    // Never trust payload.data.status on its own, even though it's present.
    const verification = await verifyFlutterwaveTransaction(transactionId);

    const isVerified =
      verification.status === "successful" &&
      verification.tx_ref === tx_ref &&
      verification.currency === "NGN" &&
      Math.abs(verification.amount - Number(order.total_amount)) < 0.01; // float rounding guard

    if (!isVerified) {
      console.error("flutterwave webhook: verification failed for tx_ref", tx_ref, {
        expectedAmount: order.total_amount,
        verifiedAmount: verification.amount,
        verifiedStatus: verification.status,
      });

      // Guard on payment_status = "pending" so a concurrent verify call
      // can't race this update into an inconsistent state.
      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", order.id)
        .eq("payment_status", "pending");

      return NextResponse.json({ received: true, verified: false }, { status: 200 });
    }

    // 4. All checks passed — mark the order paid.
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "paid" })
      .eq("id", order.id)
      .eq("payment_status", "pending"); // same race guard as above

    if (updateError) {
      console.error("flutterwave webhook: failed to update order", order.id, updateError);
      return NextResponse.json(
        { error: { code: "update_failed", message: "Failed to update order" } },
        { status: 500 }
      );
    }

    // 5. Non-essential follow-up work (e.g. notifying the vendor) happens
    // AFTER acknowledging — don't make Flutterwave's webhook call wait on it.
    // e.g. void notifyVendorOfNewOrder(order.id);

    return NextResponse.json({ received: true, verified: true }, { status: 200 });
  } catch (err) {
    // Never log the full payload here — it may contain buyer PII.
    console.error("flutterwave webhook: unexpected error for tx_ref", tx_ref, err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
