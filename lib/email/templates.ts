import {
  OrderConfirmationEmailPayload,
  OrderDispatchedEmailPayload,
  OrderInTransitEmailPayload,
  OrderDelayedEmailPayload,
  OrderDeliveredEmailPayload,
  VendorNewOrderEmailPayload,
  OrderItemEmailPayload,
} from "./types";

/**
 * Escapes HTML characters to prevent XSS in email clients.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Formats a number as a Nigerian Naira currency string (e.g. ₦18,500).
 */
export function formatNgnAmount(amount: number): string {
  const num = Number(amount) || 0;
  return `₦${num.toLocaleString("en-NG")}`;
}

/**
 * Base mobile-friendly HTML email wrapper matching Styled by Uriel's minimalist boutique aesthetic.
 */
export function wrapBaseEmailLayout(title: string, contentHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #fcf9f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #221a16;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    a {
      color: #71523c;
      text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 16px !important;
      }
      .stack-col {
        display: block !important;
        width: 100% !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #fcf9f6;">
  <center>
    <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #f0dfd8; overflow: hidden; box-shadow: 0 4px 12px rgba(34, 26, 22, 0.03);">
      
      <!-- Brand Header -->
      <tr>
        <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #f0dfd8; background-color: #221a16;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #ffffff;">
            STYLED BY URIEL
          </h1>
          <p style="margin: 6px 0 0 0; font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #fedab1;">
            Aba Atelier • Children&#39;s Streetwear
          </p>
        </td>
      </tr>

      <!-- Main Body Content -->
      <tr>
        <td style="padding: 32px 32px;">
          ${contentHtml}
        </td>
      </tr>

      <!-- Brand Footer -->
      <tr>
        <td style="padding: 24px 32px; background-color: #fff1eb; border-top: 1px solid #f0dfd8; text-align: center; font-size: 12px; color: #71523c; line-height: 1.6;">
          <p style="margin: 0 0 8px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
            Enyimba Atelier Logistics Node • Aba, Nigeria
          </p>
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #82746d;">
            Direct Artisan &amp; Waybill Inquiries: <a href="https://wa.me/2347039315917" style="color: #14532D; font-weight: 600; text-decoration: none;">WhatsApp +234 703 931 5917</a>
          </p>
          <p style="margin: 0; font-size: 11px; color: #a89a91;">
            &copy; ${new Date().getFullYear()} Styled by Uriel. All rights reserved.
          </p>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>`;
}

/**
 * Renders an items table for inclusion in emails.
 */
function renderItemsTable(items: OrderItemEmailPayload[]): string {
  if (!items || items.length === 0) return "";

  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f5ede8;">
          <div style="font-weight: 600; font-size: 14px; color: #221a16;">${escapeHtml(item.name)}</div>
          <div style="font-size: 12px; color: #71523c; margin-top: 2px;">
            ${item.size ? `Size: <strong>${escapeHtml(item.size)}</strong>` : ""}
            ${item.colour ? ` &bull; Colour: <strong>${escapeHtml(item.colour)}</strong>` : ""}
            &bull; Qty: <strong>${item.quantity}</strong>
          </div>
        </td>
        <td style="padding: 12px 0; text-align: right; vertical-align: top; border-bottom: 1px solid #f5ede8; font-size: 14px; font-weight: 700; color: #221a16;">
          ${formatNgnAmount(item.subtotal || item.unitPrice * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 24px 0;">
      <thead>
        <tr>
          <th align="left" style="padding-bottom: 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #82746d; border-bottom: 2px solid #f0dfd8;">Item Details</th>
          <th align="right" style="padding-bottom: 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #82746d; border-bottom: 2px solid #f0dfd8;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/**
 * Template 1: Customer Order Confirmation Email
 */
export function renderOrderConfirmationHtml(payload: OrderConfirmationEmailPayload): string {
  const content = `
    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #221a16;">
      Thank you for your order, ${escapeHtml(payload.customerName)}!
    </h2>
    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #50453e;">
      We have received your order <strong>#${escapeHtml(payload.orderNumber)}</strong>. Our Aba atelier artisans are now preparing your handcrafted pieces.
    </p>

    <div style="background-color: #fff1eb; border: 1px solid #f0dfd8; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 12px; color: #71523c; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Order Reference</td>
          <td align="right" style="font-size: 14px; font-weight: 800; color: #221a16; font-family: monospace;">#${escapeHtml(payload.orderNumber)}</td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #71523c; padding-top: 8px;">Delivery Address</td>
          <td align="right" style="font-size: 13px; color: #221a16; font-weight: 600; padding-top: 8px;">${escapeHtml(payload.deliveryAddress)}</td>
        </tr>
      </table>
    </div>

    <h3 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #221a16;">
      Ordered Garments
    </h3>
    ${renderItemsTable(payload.items)}

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 12px; border-top: 2px solid #221a16; padding-top: 12px;">
      <tr>
        <td style="font-size: 16px; font-weight: 800; color: #221a16;">Total Amount Paid</td>
        <td align="right" style="font-size: 18px; font-weight: 800; color: #221a16;">${formatNgnAmount(payload.totalAmount)}</td>
      </tr>
    </table>
  `;

  return wrapBaseEmailLayout(`Order Confirmation #${payload.orderNumber}`, content);
}

/**
 * Template 2: Order Dispatched Email
 */
export function renderOrderDispatchedHtml(payload: OrderDispatchedEmailPayload): string {
  const content = `
    <div style="display: inline-block; padding: 4px 10px; background-color: #fedab1; color: #795e3d; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
      Dispatched from Atelier
    </div>
    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #221a16;">
      Your order is on its way, ${escapeHtml(payload.customerName)}!
    </h2>
    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #50453e;">
      Order <strong>#${escapeHtml(payload.orderNumber)}</strong> has been packaged and handed over to our dispatch courier.
    </p>

    <div style="background-color: #fff1eb; border: 1px solid #f0dfd8; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 12px; color: #71523c; font-weight: 600;">Courier Service</td>
          <td align="right" style="font-size: 13px; font-weight: 700; color: #221a16;">${escapeHtml(payload.courier || "GIG Logistics / Aba Waybill Node")}</td>
        </tr>
        ${
          payload.trackingNumber
            ? `<tr>
                <td style="font-size: 12px; color: #71523c; padding-top: 8px; font-weight: 600;">Waybill / Tracking No.</td>
                <td align="right" style="font-size: 13px; font-weight: 800; color: #221a16; font-family: monospace; padding-top: 8px;">${escapeHtml(payload.trackingNumber)}</td>
              </tr>`
            : ""
        }
        <tr>
          <td style="font-size: 12px; color: #71523c; padding-top: 8px; font-weight: 600;">Destination</td>
          <td align="right" style="font-size: 13px; color: #221a16; font-weight: 600; padding-top: 8px;">${escapeHtml(payload.deliveryAddress)}</td>
        </tr>
      </table>
    </div>

    ${payload.items && payload.items.length > 0 ? renderItemsTable(payload.items) : ""}

    <p style="font-size: 13px; line-height: 1.5; color: #71523c; margin-top: 16px;">
      You will receive a call or SMS from the dispatch rider upon arrival at your destination.
    </p>
  `;

  return wrapBaseEmailLayout(`Order #${payload.orderNumber} Dispatched`, content);
}

/**
 * Template 3: Order In Transit Email
 */
export function renderOrderInTransitHtml(payload: OrderInTransitEmailPayload): string {
  const content = `
    <div style="display: inline-block; padding: 4px 10px; background-color: #e0f2fe; color: #0369a1; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
      In Transit
    </div>
    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #221a16;">
      Waybill In Transit — Order #${escapeHtml(payload.orderNumber)}
    </h2>
    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #50453e;">
      Hello ${escapeHtml(payload.customerName)}, your package is currently moving along the transit network toward your delivery location.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 12px; color: #64748b; font-weight: 600;">Courier</td>
          <td align="right" style="font-size: 13px; font-weight: 700; color: #0f172a;">${escapeHtml(payload.courier || "Logistics Network")}</td>
        </tr>
        ${
          payload.trackingNumber
            ? `<tr>
                <td style="font-size: 12px; color: #64748b; padding-top: 8px; font-weight: 600;">Waybill No.</td>
                <td align="right" style="font-size: 13px; font-weight: 800; color: #0f172a; font-family: monospace; padding-top: 8px;">${escapeHtml(payload.trackingNumber)}</td>
              </tr>`
            : ""
        }
        ${
          payload.currentLocationOrUpdate
            ? `<tr>
                <td style="font-size: 12px; color: #64748b; padding-top: 8px; font-weight: 600;">Status Update</td>
                <td align="right" style="font-size: 13px; color: #0f172a; font-weight: 600; padding-top: 8px;">${escapeHtml(payload.currentLocationOrUpdate)}</td>
              </tr>`
            : ""
        }
        <tr>
          <td style="font-size: 12px; color: #64748b; padding-top: 8px; font-weight: 600;">Destination</td>
          <td align="right" style="font-size: 13px; color: #0f172a; font-weight: 600; padding-top: 8px;">${escapeHtml(payload.deliveryAddress)}</td>
        </tr>
      </table>
    </div>
  `;

  return wrapBaseEmailLayout(`Order #${payload.orderNumber} is In Transit`, content);
}

/**
 * Template 4: Order Delayed Email
 */
export function renderOrderDelayedHtml(payload: OrderDelayedEmailPayload): string {
  const content = `
    <div style="display: inline-block; padding: 4px 10px; background-color: #fee2e2; color: #b91c1c; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
      Delivery Notice
    </div>
    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #221a16;">
      Update regarding Order #${escapeHtml(payload.orderNumber)}
    </h2>
    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #50453e;">
      Hello ${escapeHtml(payload.customerName)}, we wanted to notify you of a slight delay with your order delivery.
    </p>

    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #991b1b;">Reason for delay</p>
      <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.5;">
        ${escapeHtml(payload.reason || "Interstate transit delay / logistics hold. Our atelier team is closely tracking the waybill.")}
      </p>
      ${
        payload.updatedEstimate
          ? `<p style="margin: 12px 0 0 0; font-size: 13px; color: #991b1b; font-weight: 600;">
              Expected delivery: ${escapeHtml(payload.updatedEstimate)}
            </p>`
          : ""
      }
    </div>

    <p style="font-size: 13px; line-height: 1.6; color: #50453e;">
      Our team is monitoring your shipment continuously. If you need any direct update, feel free to reach out to Natasha on WhatsApp directly.
    </p>
  `;

  return wrapBaseEmailLayout(`Delivery Update: Order #${payload.orderNumber}`, content);
}

/**
 * Template 5: Order Delivered Email
 */
export function renderOrderDeliveredHtml(payload: OrderDeliveredEmailPayload): string {
  const content = `
    <div style="display: inline-block; padding: 4px 10px; background-color: #e8f5e9; color: #2e7d32; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
      Delivered
    </div>
    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #221a16;">
      Your order has arrived, ${escapeHtml(payload.customerName)}!
    </h2>
    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #50453e;">
      Order <strong>#${escapeHtml(payload.orderNumber)}</strong> has been marked as delivered at:
    </p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #166534;">Delivered to</p>
      <p style="margin: 0; font-size: 14px; font-weight: 600; color: #14532d;">${escapeHtml(payload.deliveryAddress)}</p>
    </div>

    ${payload.items && payload.items.length > 0 ? renderItemsTable(payload.items) : ""}

    <p style="font-size: 14px; line-height: 1.6; color: #50453e; margin-top: 16px;">
      We hope you love your new bespoke streetwear pieces! Thank you for supporting our Aba craft artisans.
    </p>
  `;

  return wrapBaseEmailLayout(`Order #${payload.orderNumber} Delivered`, content);
}

/**
 * Template 6: Vendor New Order Notification Email
 */
export function renderVendorNewOrderHtml(payload: VendorNewOrderEmailPayload): string {
  const content = `
    <div style="display: inline-block; padding: 4px 10px; background-color: #fff1eb; color: #71523c; border: 1px solid #f0dfd8; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
      New Customer Order
    </div>
    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #221a16;">
      New Order #${escapeHtml(payload.orderNumber)}
    </h2>
    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #50453e;">
      A customer has placed an order on Styled by Uriel. Payment status: <strong style="text-transform: uppercase; color: #2e7d32;">${escapeHtml(payload.paymentStatus)}</strong>.
    </p>

    <div style="background-color: #fcf9f6; border: 1px solid #f0dfd8; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 12px; color: #71523c; font-weight: 600;">Customer</td>
          <td align="right" style="font-size: 13px; font-weight: 700; color: #221a16;">${escapeHtml(payload.customerName)}</td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #71523c; padding-top: 6px; font-weight: 600;">Phone</td>
          <td align="right" style="font-size: 13px; font-weight: 600; color: #221a16; padding-top: 6px;">${escapeHtml(payload.customerPhone)}</td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #71523c; padding-top: 6px; font-weight: 600;">Email</td>
          <td align="right" style="font-size: 13px; font-weight: 600; color: #221a16; padding-top: 6px;">${escapeHtml(payload.customerEmail)}</td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #71523c; padding-top: 6px; font-weight: 600;">Destination</td>
          <td align="right" style="font-size: 13px; font-weight: 600; color: #221a16; padding-top: 6px;">${escapeHtml(payload.deliveryAddress)}</td>
        </tr>
      </table>
    </div>

    <h3 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #221a16;">
      Items to Fulfill
    </h3>
    ${renderItemsTable(payload.items)}

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 12px; border-top: 2px solid #221a16; padding-top: 12px;">
      <tr>
        <td style="font-size: 16px; font-weight: 800; color: #221a16;">Gross Total</td>
        <td align="right" style="font-size: 18px; font-weight: 800; color: #221a16;">${formatNgnAmount(payload.totalAmount)}</td>
      </tr>
    </table>
  `;

  return wrapBaseEmailLayout(`New Order #${payload.orderNumber} Received`, content);
}
