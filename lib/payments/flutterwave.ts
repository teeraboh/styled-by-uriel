import { env, getServerEnv } from "@/lib/env";

export interface InitializePaymentParams {
  txRef: string;
  amount: number;
  currency?: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  orderId: string;
}

export interface InitializePaymentResult {
  paymentLink: string;
  txRef: string;
}

export class FlutterwaveError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code = "payment_initiation_failed", statusCode = 502) {
    super(message);
    this.name = "FlutterwaveError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Generate a unique Flutterwave transaction reference.
 * Format: SBU-<timestamp>-<random_chars>
 */
export function generateTransactionReference(): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SBU-${timestamp}-${randomSuffix}`;
}

/**
 * Server-only helper to initialize a hosted checkout link with Flutterwave standard API.
 * Never exposes the secret key to client components.
 */
export async function initializeFlutterwavePayment(
  params: InitializePaymentParams
): Promise<InitializePaymentResult> {
  const { FLUTTERWAVE_SECRET_KEY } = getServerEnv();

  if (!FLUTTERWAVE_SECRET_KEY) {
    console.error("[Flutterwave] FLUTTERWAVE_SECRET_KEY is missing from server configuration.");
    throw new FlutterwaveError(
      "Payment gateway configuration error. Please contact store support.",
      "gateway_misconfigured",
      500
    );
  }

  const redirectUrl = `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/payments/verify`;

  const payload = {
    tx_ref: params.txRef,
    amount: Number(params.amount),
    currency: params.currency || "NGN",
    redirect_url: redirectUrl,
    customer: {
      email: params.customerEmail,
      phonenumber: params.customerPhone,
      phone_number: params.customerPhone,
      name: params.customerName,
    },
    customizations: {
      title: "Styled by Uriel",
      description: "Children's Boutique Streetwear • Aba Atelier",
    },
    meta: {
      order_id: params.orderId,
    },
  };

  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success" || !data.data?.link) {
      console.error(
        "[Flutterwave] Payment initiation returned error:",
        data.message || response.statusText
      );
      throw new FlutterwaveError(
        data.message || "Failed to initiate payment session with Flutterwave.",
        "flutterwave_api_error",
        response.status >= 500 ? 502 : 400
      );
    }

    return {
      paymentLink: data.data.link as string,
      txRef: params.txRef,
    };
  } catch (err: unknown) {
    if (err instanceof FlutterwaveError) {
      throw err;
    }
    console.error("[Flutterwave] Network or unexpected error calling Flutterwave API:", err);
    throw new FlutterwaveError(
      "Unable to connect to payment gateway. Please try again.",
      "gateway_network_error",
      502
    );
  }
}

export interface VerifiedFlutterwaveTransaction {
  id: number;
  txRef: string;
  flwRef: string;
  amount: number;
  chargedAmount: number;
  currency: string;
  status: "successful" | "failed" | string;
  paymentType?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  orderIdMeta?: string;
}

/**
 * Server-only helper to verify a transaction with Flutterwave API.
 * Uses FLUTTERWAVE_SECRET_KEY server-side only.
 */
export async function verifyFlutterwaveTransaction(
  transactionId: string | number
): Promise<VerifiedFlutterwaveTransaction> {
  const { FLUTTERWAVE_SECRET_KEY } = getServerEnv();

  if (!FLUTTERWAVE_SECRET_KEY) {
    console.error("[Flutterwave] FLUTTERWAVE_SECRET_KEY is missing from server configuration.");
    throw new FlutterwaveError(
      "Payment gateway configuration error. Please contact store support.",
      "gateway_misconfigured",
      500
    );
  }

  const cleanId = String(transactionId).trim();
  if (!cleanId) {
    throw new FlutterwaveError("Transaction ID is required for verification.", "invalid_transaction_id", 400);
  }

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(cleanId)}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || data.status !== "success" || !data.data) {
      console.error(
        "[Flutterwave] Transaction verification returned error:",
        data.message || response.statusText
      );
      throw new FlutterwaveError(
        data.message || "Transaction could not be verified with Flutterwave.",
        "verification_failed",
        response.status === 404 ? 404 : 400
      );
    }

    const tx = data.data;

    return {
      id: tx.id,
      txRef: tx.tx_ref,
      flwRef: tx.flw_ref,
      amount: Number(tx.amount),
      chargedAmount: Number(tx.charged_amount),
      currency: tx.currency,
      status: tx.status,
      paymentType: tx.payment_type,
      customerEmail: tx.customer?.email,
      customerPhone: tx.customer?.phone_number,
      customerName: tx.customer?.name,
      orderIdMeta: tx.meta?.order_id,
    };
  } catch (err: unknown) {
    if (err instanceof FlutterwaveError) {
      throw err;
    }
    console.error("[Flutterwave] Network or unexpected error verifying transaction:", err);
    throw new FlutterwaveError(
      "Unable to connect to payment gateway to verify transaction. Please try again.",
      "gateway_network_error",
      502
    );
  }
}
