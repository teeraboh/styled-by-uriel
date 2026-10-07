import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerEnv } from "@/lib/env";
import { processPaymentVerification } from "@/lib/payments/service";

/**
 * POST /api/payments/webhook
 *
 * Production-ready Flutterwave Webhook Listener.
 * Receives asynchronous server-to-server event notifications from Flutterwave.
 *
 * Security & Reliability Invariants:
 * 1. Validates the `verif-hash` header against `FLUTTERWAVE_WEBHOOK_HASH` using a constant-time comparison.
 * 2. Never trusts the webhook payload alone; always re-verifies the transaction server-to-server via Flutterwave's verify API.
 * 3. Uses atomic Compare-And-Swap (CAS) in `processPaymentVerification` to ensure stock is decremented and confirmation emails are sent EXACTLY ONCE, even if the customer's browser redirect arrives simultaneously.
 * 4. Never exposes or logs secrets in output or telemetry.
 */
export async function POST(req: NextRequest) {
  try {
    const { FLUTTERWAVE_WEBHOOK_HASH } = getServerEnv();

    if (!FLUTTERWAVE_WEBHOOK_HASH) {
      console.error("[POST /api/payments/webhook] FLUTTERWAVE_WEBHOOK_HASH is not configured on the server.");
      return NextResponse.json(
        { error: { code: "webhook_misconfigured", message: "Webhook secret is not configured." } },
        { status: 500 }
      );
    }

    // 1. Validate Flutterwave webhook signature header (`verif-hash`)
    const signature = req.headers.get("verif-hash");

    if (!signature) {
      console.warn("[POST /api/payments/webhook] Webhook request received without verif-hash header.");
      return NextResponse.json(
        { error: { code: "missing_signature", message: "Missing verification header." } },
        { status: 401 }
      );
    }

    // Constant-time comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(FLUTTERWAVE_WEBHOOK_HASH);

    const isMatch =
      signatureBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!isMatch) {
      console.warn("[POST /api/payments/webhook] Invalid webhook signature received.");
      return NextResponse.json(
        { error: { code: "invalid_signature", message: "Invalid verification header." } },
        { status: 401 }
      );
    }

    // 2. Parse JSON payload
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: { code: "invalid_json", message: "Request body is not valid JSON." } },
        { status: 400 }
      );
    }

    // 3. Extract transaction ID from webhook payload
    // Flutterwave sends: { event: "charge.completed", data: { id: 123456, tx_ref: "...", ... } }
    const transactionId = body?.data?.id ?? body?.id;
    const txRef = body?.data?.tx_ref ?? body?.tx_ref;

    if (!transactionId) {
      // If Flutterwave sends a ping or a non-transaction event, acknowledge receipt with 200 so it stops retrying
      console.log("[POST /api/payments/webhook] Acknowledged non-transaction webhook event:", body?.event || "unknown");
      return NextResponse.json(
        { status: "ignored", message: "No transaction ID present in event payload." },
        { status: 200 }
      );
    }

    // 4. Server-to-server re-verification: DO NOT trust payload data
    // Fetch authoritative status directly from Flutterwave API and process order transitions idempotently
    const { result, error } = await processPaymentVerification(String(transactionId), txRef);

    if (error) {
      console.error(
        `[POST /api/payments/webhook] Payment verification failed for transaction ${transactionId}:`,
        error.message
      );
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode >= 500 ? 500 : 400 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        orderId: result?.orderId,
        paymentStatus: result?.paymentStatus,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[POST /api/payments/webhook] Unexpected webhook error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "An unexpected error occurred while processing webhook." } },
      { status: 500 }
    );
  }
}
