import "server-only";
import { Resend } from "resend";
import {
  OrderConfirmationEmailPayload,
  OrderDispatchedEmailPayload,
  OrderInTransitEmailPayload,
  OrderDelayedEmailPayload,
  OrderDeliveredEmailPayload,
  VendorNewOrderEmailPayload,
  SendEmailResult,
} from "./types";
import {
  renderOrderConfirmationHtml,
  renderOrderDispatchedHtml,
  renderOrderInTransitHtml,
  renderOrderDelayedHtml,
  renderOrderDeliveredHtml,
  renderVendorNewOrderHtml,
  escapeHtml,
  formatNgnAmount,
} from "./templates";

export * from "./types";
export { escapeHtml, formatNgnAmount };

const SENDER_EMAIL = "Styled by Uriel <onboarding@resend.dev>";

/**
 * Lazily instantiate the Resend client.
 */
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[Email Service] RESEND_API_KEY is not configured.");
    return null;
  }
  return new Resend(apiKey);
}

/**
 * 1. Customer Order Confirmation Email
 */
export async function sendOrderConfirmationEmail(
  payload: OrderConfirmationEmailPayload
): Promise<SendEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  try {
    const html = renderOrderConfirmationHtml(payload);
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [payload.customerEmail],
      subject: `Order Confirmation #${payload.orderNumber} — Styled by Uriel`,
      html,
    });

    if (error) {
      console.error("[sendOrderConfirmationEmail] Resend API error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    console.error("[sendOrderConfirmationEmail] Exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * 2. Order Dispatched Email
 */
export async function sendOrderDispatchedEmail(
  payload: OrderDispatchedEmailPayload
): Promise<SendEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  try {
    const html = renderOrderDispatchedHtml(payload);
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [payload.customerEmail],
      subject: `Order #${payload.orderNumber} Dispatched — Styled by Uriel`,
      html,
    });

    if (error) {
      console.error("[sendOrderDispatchedEmail] Resend API error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    console.error("[sendOrderDispatchedEmail] Exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * 3. Order In Transit Email
 */
export async function sendOrderInTransitEmail(
  payload: OrderInTransitEmailPayload
): Promise<SendEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  try {
    const html = renderOrderInTransitHtml(payload);
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [payload.customerEmail],
      subject: `Order #${payload.orderNumber} is In Transit — Styled by Uriel`,
      html,
    });

    if (error) {
      console.error("[sendOrderInTransitEmail] Resend API error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    console.error("[sendOrderInTransitEmail] Exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * 4. Order Delayed Email
 */
export async function sendOrderDelayedEmail(
  payload: OrderDelayedEmailPayload
): Promise<SendEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  try {
    const html = renderOrderDelayedHtml(payload);
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [payload.customerEmail],
      subject: `Delivery Notice for Order #${payload.orderNumber} — Styled by Uriel`,
      html,
    });

    if (error) {
      console.error("[sendOrderDelayedEmail] Resend API error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    console.error("[sendOrderDelayedEmail] Exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * 5. Order Delivered Email
 */
export async function sendOrderDeliveredEmail(
  payload: OrderDeliveredEmailPayload
): Promise<SendEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  try {
    const html = renderOrderDeliveredHtml(payload);
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [payload.customerEmail],
      subject: `Order #${payload.orderNumber} Delivered — Styled by Uriel`,
      html,
    });

    if (error) {
      console.error("[sendOrderDeliveredEmail] Resend API error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    console.error("[sendOrderDeliveredEmail] Exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * 6. Vendor New Order Notification Email
 */
export async function sendVendorNewOrderEmail(
  payload: VendorNewOrderEmailPayload
): Promise<SendEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  try {
    const html = renderVendorNewOrderHtml(payload);
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [payload.vendorEmail],
      subject: `New Customer Order #${payload.orderNumber} (₦${payload.totalAmount.toLocaleString()})`,
      html,
    });

    if (error) {
      console.error("[sendVendorNewOrderEmail] Resend API error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    console.error("[sendVendorNewOrderEmail] Exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
