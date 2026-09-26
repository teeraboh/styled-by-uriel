import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  verifyFlutterwaveTransaction,
  FlutterwaveError,
  VerifiedFlutterwaveTransaction,
} from "@/lib/payments/flutterwave";
import {
  sendOrderConfirmationEmail,
  sendVendorNewOrderEmail,
  OrderItemEmailPayload,
} from "@/lib/email";

const verifyBodySchema = z
  .object({
    transactionId: z.union([z.string(), z.number()]).transform((val) => String(val).trim()),
    txRef: z.string().optional(),
  })
  .strict();

interface VerifyOrderResult {
  success: boolean;
  orderId: string;
  paymentStatus: string;
  transactionReference: string;
  message?: string;
}

/**
 * Core server-side verification logic.
 * Validates Flutterwave API transaction against Supabase database order record.
 */
async function processPaymentVerification(
  transactionId: string,
  clientTxRef?: string
): Promise<{ result?: VerifyOrderResult; error?: { code: string; message: string; statusCode: number } }> {
  const adminClient = createAdminClient();

  // 1. Fetch verified transaction data directly from Flutterwave API (server-side only)
  let verified: VerifiedFlutterwaveTransaction;
  try {
    verified = await verifyFlutterwaveTransaction(transactionId);
  } catch (err: unknown) {
    if (err instanceof FlutterwaveError) {
      return {
        error: {
          code: err.code,
          message: err.message,
          statusCode: err.statusCode,
        },
      };
    }
    return {
      error: {
        code: "verification_service_error",
        message: "Failed to communicate with payment gateway.",
        statusCode: 502,
      },
    };
  }

  // 2. Identify the transaction reference to look up the order
  const txRefToFind = verified.txRef || clientTxRef;
  if (!txRefToFind) {
    return {
      error: {
        code: "missing_tx_ref",
        message: "No transaction reference associated with this payment.",
        statusCode: 400,
      },
    };
  }

  // 3. Load order from Supabase by stored flutterwave_reference
  let { data: order, error: orderError } = await adminClient
    .from("orders")
    .select(`
      id,
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      total_amount,
      payment_status,
      delivery_status,
      flutterwave_reference,
      order_items (
        id,
        product_id,
        product_name_snapshot,
        selected_size,
        selected_colour,
        quantity,
        unit_price,
        subtotal
      )
    `)
    .eq("flutterwave_reference", txRefToFind)
    .single();

  // Fallback: If not found by txRef and orderIdMeta is present in Flutterwave metadata
  if ((orderError || !order) && verified.orderIdMeta) {
    const fallback = await adminClient
      .from("orders")
      .select(`
        id,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        total_amount,
        payment_status,
        delivery_status,
        flutterwave_reference,
        order_items (
          id,
          product_id,
          product_name_snapshot,
          selected_size,
          selected_colour,
          quantity,
          unit_price,
          subtotal
        )
      `)
      .eq("id", verified.orderIdMeta)
      .single();
    if (fallback.data) {
      order = fallback.data;
      orderError = null;
    }
  }

  if (orderError || !order) {
    console.error("[processPaymentVerification] Order not found for txRef:", txRefToFind);
    return {
      error: {
        code: "order_not_found",
        message: "No matching order found for this payment reference.",
        statusCode: 404,
      },
    };
  }

  // 4. Idempotency Check: If order is already paid, return success without re-processing, re-decrementing, or re-sending emails
  if (order.payment_status === "paid") {
    return {
      result: {
        success: true,
        orderId: order.id,
        paymentStatus: "paid",
        transactionReference: order.flutterwave_reference || verified.txRef,
        message: "Order has already been verified and marked as paid.",
      },
    };
  }

  // 5. Check if Flutterwave marked the transaction as successful
  if (verified.status !== "successful") {
    console.warn(
      `[processPaymentVerification] Transaction status is "${verified.status}" for order ${order.id}`
    );

    // Update order to failed if it was pending
    if (order.payment_status === "pending") {
      await adminClient
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", order.id);
    }

    return {
      error: {
        code: "payment_not_successful",
        message: `Payment status from gateway is "${verified.status}". Order has not been marked as paid.`,
        statusCode: 400,
      },
    };
  }

  // 6. Security Invariants (NEVER trust client data, compare only verified gateway data against DB)
  // Invariant A: Transaction reference match
  if (order.flutterwave_reference && verified.txRef !== order.flutterwave_reference) {
    console.error(
      `[processPaymentVerification] tx_ref mismatch! Gateway: "${verified.txRef}", DB: "${order.flutterwave_reference}"`
    );
    return {
      error: {
        code: "transaction_reference_mismatch",
        message: "Transaction reference does not match order record.",
        statusCode: 400,
      },
    };
  }

  // Invariant B: Currency match
  if (verified.currency !== "NGN") {
    console.error(
      `[processPaymentVerification] Currency mismatch! Expected NGN, got "${verified.currency}"`
    );
    return {
      error: {
        code: "currency_mismatch",
        message: "Payment currency does not match store currency (NGN).",
        statusCode: 400,
      },
    };
  }

  // Invariant C: Amount sufficiency
  const orderAmount = Number(order.total_amount);
  const paidAmount = Number(verified.amount);

  if (paidAmount < orderAmount) {
    console.error(
      `[processPaymentVerification] Amount insufficient! Order: NGN ${orderAmount}, Paid: NGN ${paidAmount}`
    );
    return {
      error: {
        code: "insufficient_amount_paid",
        message: `Paid amount (NGN ${paidAmount}) is less than order total (NGN ${orderAmount}).`,
        statusCode: 400,
      },
    };
  }

  // 7. Update order to 'paid' in Supabase
  // Strictly preserves existing delivery_status
  const { error: updateError } = await adminClient
    .from("orders")
    .update({
      payment_status: "paid",
      flutterwave_reference: verified.txRef,
    })
    .eq("id", order.id);

  if (updateError) {
    console.error("[processPaymentVerification] Database update error:", updateError.message);
    return {
      error: {
        code: "database_update_failed",
        message: "Failed to update order payment status in database.",
        statusCode: 500,
      },
    };
  }

  // 8. Atomically decrement stock exactly once using decrement_stock RPC
  // Idempotency: Because orders.payment_status is now "paid", subsequent calls are caught by step 4 above.
  if (Array.isArray(order.order_items)) {
    for (const item of order.order_items) {
      if (item.product_id && item.quantity > 0) {
        try {
          const { data: decSuccess, error: decError } = await adminClient.rpc(
            "decrement_stock",
            {
              p_product_id: item.product_id,
              p_quantity: item.quantity,
            }
          );
          if (decError) {
            console.error(
              `[processPaymentVerification] Failed to decrement stock for product ${item.product_id}:`,
              decError.message
            );
          } else {
            console.log(
              `[processPaymentVerification] Stock decremented for product ${item.product_id} (-${item.quantity}), result:`,
              decSuccess
            );
          }
        } catch (stockErr) {
          console.error(
            `[processPaymentVerification] Exception decrementing stock for product ${item.product_id}:`,
            stockErr
          );
        }
      }
    }
  }

  // 9. Dispatch Order Confirmation Email safely (only on actual pending -> paid transition)
  if (order.customer_email) {
    try {
      const emailItems: OrderItemEmailPayload[] = Array.isArray(order.order_items)
        ? order.order_items.map((item: any) => ({
            name: item.product_name_snapshot || "Boutique Garment",
            quantity: Number(item.quantity) || 1,
            size: item.selected_size || null,
            colour: item.selected_colour || null,
            unitPrice: Number(item.unit_price) || 0,
            subtotal:
              Number(item.subtotal) ||
              (Number(item.unit_price) || 0) * (Number(item.quantity) || 1),
          }))
        : [];

      const emailResult = await sendOrderConfirmationEmail({
        customerName: order.customer_name || "Valued Customer",
        customerEmail: order.customer_email,
        orderNumber: verified.txRef || order.flutterwave_reference || order.id,
        items: emailItems,
        totalAmount: Number(order.total_amount) || 0,
        deliveryAddress: order.delivery_address || "Aba Atelier Node",
        customerPhone: order.customer_phone || undefined,
        paymentMethod: "Flutterwave",
      });

      if (!emailResult.success) {
        console.warn(
          "[processPaymentVerification] Order confirmation email notice:",
          emailResult.error
        );
      } else {
        console.log(
          "[processPaymentVerification] Order confirmation email sent successfully. ID:",
          emailResult.messageId
        );
      }
    } catch (emailErr: unknown) {
      // Safe error logging: Never fail payment or expose secrets if email delivery fails
      console.error(
        "[processPaymentVerification] Failed to dispatch order confirmation email:",
        emailErr instanceof Error ? emailErr.message : "Unknown email error"
      );
    }
  }

  // 10. Dispatch Vendor New Order Notification Email safely (only on actual pending -> paid transition)
  const vendorRecipient =
    process.env.VENDOR_EMAIL?.trim() || process.env.RESEND_TEST_EMAIL?.trim();

  if (vendorRecipient) {
    try {
      const vendorEmailItems: OrderItemEmailPayload[] = Array.isArray(order.order_items)
        ? order.order_items.map((item: any) => ({
            name: item.product_name_snapshot || "Boutique Garment",
            quantity: Number(item.quantity) || 1,
            size: item.selected_size || null,
            colour: item.selected_colour || null,
            unitPrice: Number(item.unit_price) || 0,
            subtotal:
              Number(item.subtotal) ||
              (Number(item.unit_price) || 0) * (Number(item.quantity) || 1),
          }))
        : [];

      const vendorEmailResult = await sendVendorNewOrderEmail({
        vendorEmail: vendorRecipient,
        orderNumber: verified.txRef || order.flutterwave_reference || order.id,
        customerName: order.customer_name || "Guest Customer",
        customerEmail: order.customer_email || "N/A",
        customerPhone: order.customer_phone || "N/A",
        deliveryAddress: order.delivery_address || "Aba Atelier Node",
        items: vendorEmailItems,
        totalAmount: Number(order.total_amount) || 0,
        paymentStatus: "paid",
        orderDate: new Date().toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      if (!vendorEmailResult.success) {
        console.warn(
          "[processPaymentVerification] Vendor order notification email notice:",
          vendorEmailResult.error
        );
      } else {
        console.log(
          "[processPaymentVerification] Vendor order notification email sent successfully. ID:",
          vendorEmailResult.messageId
        );
      }
    } catch (vendorEmailErr: unknown) {
      // Safe error logging: Never fail payment or expose secrets if email delivery fails
      console.error(
        "[processPaymentVerification] Failed to dispatch vendor new order notification email:",
        vendorEmailErr instanceof Error ? vendorEmailErr.message : "Unknown email error"
      );
    }
  }

  return {
    result: {
      success: true,
      orderId: order.id,
      paymentStatus: "paid",
      transactionReference: verified.txRef,
    },
  };
}

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
