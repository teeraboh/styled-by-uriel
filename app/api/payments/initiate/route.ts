import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  generateTransactionReference,
  initializeFlutterwavePayment,
  FlutterwaveError,
} from "@/lib/payments/flutterwave";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const initiateSchema = z
  .object({
    orderId: z.string().uuid("Invalid order ID format"),
  })
  .strict();

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting check (10 requests per 10 minutes per requester)
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, {
      prefix: "payments-initiate",
      limit: 10,
      windowSeconds: 600,
    });

    if (!rateLimit.success) {
      const retryAfter = Math.max(1, rateLimit.reset - Math.ceil(Date.now() / 1000));
      return NextResponse.json(
        {
          error: {
            code: "rate_limited",
            message: "Too many requests. Please try again later.",
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.reset),
          },
        }
      );
    }

    const json = await req.json();
    const parsed = initiateSchema.safeParse(json);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        {
          error: {
            code: "invalid_input",
            message: firstIssue?.message || "Invalid request payload",
          },
        },
        { status: 400 }
      );
    }

    const { orderId } = parsed.data;
    const adminClient = createAdminClient();

    // 1. Fetch order directly from Supabase
    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          error: {
            code: "order_not_found",
            message: "The specified order was not found.",
          },
        },
        { status: 404 }
      );
    }

    // 2. Validate that order is still pending payment
    if (order.payment_status !== "pending") {
      return NextResponse.json(
        {
          error: {
            code: "invalid_order_status",
            message: `Order cannot be processed because its payment status is already "${order.payment_status}".`,
          },
        },
        { status: 400 }
      );
    }

    // 3. Generate a unique transaction reference
    const txRef = generateTransactionReference();

    // 4. Update the order with the generated reference
    const { error: updateError } = await adminClient
      .from("orders")
      .update({ flutterwave_reference: txRef })
      .eq("id", orderId);

    if (updateError) {
      console.error("[POST /api/payments/initiate] Failed to save tx_ref on order:", updateError.message);
      return NextResponse.json(
        {
          error: {
            code: "database_update_failed",
            message: "Failed to record payment reference. Please try again.",
          },
        },
        { status: 500 }
      );
    }

    // 5. Initialize payment session with Flutterwave using database order amount
    const paymentResult = await initializeFlutterwavePayment({
      txRef,
      amount: Number(order.total_amount),
      currency: "NGN",
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      customerName: order.customer_name,
      orderId: order.id,
    });

    return NextResponse.json(
      {
        orderId: order.id,
        transactionReference: paymentResult.txRef,
        paymentLink: paymentResult.paymentLink,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof FlutterwaveError) {
      return NextResponse.json(
        {
          error: {
            code: err.code,
            message: err.message,
          },
        },
        { status: err.statusCode }
      );
    }

    console.error("[POST /api/payments/initiate] Unexpected error:", err);

    return NextResponse.json(
      {
        error: {
          code: "payment_initiation_failed",
          message: "Unable to initiate payment session. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
