import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processPaymentVerification } from "@/lib/payments/service";

const verifyBodySchema = z
  .object({
    transactionId: z.union([z.string(), z.number()]).transform((val) => String(val).trim()),
    txRef: z.string().optional(),
  })
  .strict();


/**
 * POST /api/payments/verify
 * Programmatic JSON endpoint for server or client verification calls.
 */
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = verifyBodySchema.safeParse(json);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        {
          error: {
            code: "invalid_input",
            message: issue?.message || "Invalid request payload",
          },
        },
        { status: 400 }
      );
    }

    const { transactionId, txRef } = parsed.data;
    const { result, error } = await processPaymentVerification(transactionId, txRef);

    if (error) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("[POST /api/payments/verify] Unexpected error:", err);
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: "An unexpected error occurred while verifying payment.",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments/verify
 * Handles browser redirect after Flutterwave hosted checkout.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get("transaction_id");
  const txRef = searchParams.get("tx_ref") || undefined;
  const status = searchParams.get("status");

  const baseUrl = req.nextUrl.origin;

  // If user cancelled on Flutterwave checkout
  if (status === "cancelled" || !transactionId) {
    return NextResponse.redirect(`${baseUrl}/checkout?error=payment_cancelled`);
  }

  const { result, error } = await processPaymentVerification(transactionId, txRef);

  if (error || !result) {
    console.error("[GET /api/payments/verify] Verification failed on redirect:", error);
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=${encodeURIComponent(error?.code || "payment_verification_failed")}`
    );
  }

  // Redirect to order confirmation page
  return NextResponse.redirect(
    `${baseUrl}/checkout/confirmation?ref=${encodeURIComponent(result.orderId)}&payment=success`
  );
}
