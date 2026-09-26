import { createAdminClient } from "@/lib/supabase/admin";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validation/checkout";
import { z } from "zod";
import {
  sendOrderDispatchedEmail,
  sendOrderInTransitEmail,
  sendOrderDeliveredEmail,
  sendOrderDelayedEmail,
  OrderItemEmailPayload,
} from "@/lib/email";

export const orderItemInputSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  selectedColour: z.string().nullable().optional(),
  selectedSize: z.string().nullable().optional(),
});

export const createOrderSchema = z.object({
  customer: checkoutSchema,
  items: z.array(orderItemInputSchema).min(1, "Cart cannot be empty"),
});

export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export interface CreateOrderResult {
  orderId: string;
  totalAmount: number;
  currency: string;
  status: "pending";
}

export class OrderValidationError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code = "invalid_order", statusCode = 400) {
    super(message);
    this.name = "OrderValidationError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Creates a pending order and line items in Supabase.
 * Validates product existence, availability, and stock.
 * Calculates prices server-side from the live database.
 */
export async function createPendingOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const { customer, items } = input;
  const adminClient = createAdminClient();

  // 1. Fetch live product data for all requested items
  const productIds = Array.from(new Set(items.map((i) => i.productId)));
  const { data: products, error: productsError } = await adminClient
    .from("products")
    .select("id, name, price, availability, stock_quantity")
    .in("id", productIds);

  if (productsError) {
    console.error("[createPendingOrder] Database error fetching products:", productsError.message);
    throw new Error("Failed to verify product availability");
  }

  const productMap = new Map((products || []).map((p) => [p.id, p]));

  // 2. Validate availability, stock, and calculate subtotal server-side
  const calculatedItems: {
    productId: string;
    productName: string;
    quantity: number;
    selectedColour: string | null;
    selectedSize: string | null;
    unitPrice: number;
    subtotal: number;
  }[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new OrderValidationError(
        `One or more products in your cart could not be found.`,
        "product_not_found",
        404
      );
    }

    if (!product.availability) {
      throw new OrderValidationError(
        `"${product.name}" is currently out of stock.`,
        "product_unavailable",
        400
      );
    }

    if (item.quantity > product.stock_quantity) {
      throw new OrderValidationError(
        `Requested quantity for "${product.name}" (${item.quantity}) exceeds available stock (${product.stock_quantity}).`,
        "insufficient_stock",
        400
      );
    }

    const unitPrice = Number(product.price);
    const subtotal = unitPrice * item.quantity;

    calculatedItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      selectedColour: item.selectedColour ?? null,
      selectedSize: item.selectedSize ?? null,
      unitPrice,
      subtotal,
    });
  }

  // 3. Compute final order total server-side
  const totalAmount = calculatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  // 4. Format combined delivery address and customer name
  const customerName = `${customer.firstName.trim()} ${customer.lastName.trim()}`;
  const addressParts = [
    customer.streetAddress.trim(),
    customer.landmark?.trim() ? `Landmark: ${customer.landmark.trim()}` : null,
    customer.city.trim(),
    customer.state.trim(),
  ].filter(Boolean);
  const deliveryAddress = addressParts.join(", ");

  // 5. Insert order into public.orders
  const { data: order, error: orderError } = await adminClient
    .from("orders")
    .insert({
      customer_name: customerName,
      customer_email: customer.email.trim().toLowerCase(),
      customer_phone: customer.phone.trim(),
      delivery_address: deliveryAddress,
      total_amount: totalAmount,
      payment_status: "pending",
      customer_id: null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[createPendingOrder] Failed to create order record:", orderError?.message);
    throw new Error("Failed to create order record");
  }

  // 6. Insert line items into public.order_items
  const orderItemsPayload = calculatedItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name_snapshot: item.productName,
    quantity: item.quantity,
    selected_colour: item.selectedColour,
    selected_size: item.selectedSize,
    unit_price: item.unitPrice,
    subtotal: item.subtotal,
  }));

  const { error: itemsError } = await adminClient
    .from("order_items")
    .insert(orderItemsPayload);

  if (itemsError) {
    console.error("[createPendingOrder] Failed to insert order items:", itemsError.message);
    // Cleanup order record on failure to avoid orphaned records
    await adminClient.from("orders").delete().eq("id", order.id);
    throw new Error("Failed to save order items");
  }

  return {
    orderId: order.id,
    totalAmount,
    currency: "NGN",
    status: "pending",
  };
}

import type { DeliveryStatus } from "@/types";

export interface VendorOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  quantity: number;
  selected_colour: string | null;
  selected_size: string | null;
  unit_price: number;
  subtotal: number;
}

export interface VendorOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  payment_status: string;
  delivery_status?: DeliveryStatus;
  flutterwave_reference: string | null;
  customer_id: string | null;
  created_at: string;
  order_items: VendorOrderItem[];
}

/**
 * Fetches all orders with their associated order_items for authenticated vendor.
 */
export async function getVendorOrders(): Promise<VendorOrder[]> {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
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
      customer_id,
      created_at,
      order_items (
        id,
        order_id,
        product_id,
        product_name_snapshot,
        quantity,
        selected_colour,
        selected_size,
        unit_price,
        subtotal
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getVendorOrders] Supabase query error:", error.message);
    throw new Error("Failed to fetch vendor orders from database");
  }

  return (data || []) as VendorOrder[];
}

/**
 * Updates the delivery status of an order (vendor only).
 * Never modifies payment_status or inventory stock.
 * Dispatches a customer email only on the genuine transition from confirmed -> dispatched.
 */
export async function updateOrderDeliveryStatus(
  orderId: string,
  deliveryStatus: DeliveryStatus
): Promise<VendorOrder> {
  const adminClient = createAdminClient();

  // 1. Fetch current delivery status to reliably detect state transition
  const { data: currentOrder, error: currentErr } = await adminClient
    .from("orders")
    .select("id, delivery_status")
    .eq("id", orderId)
    .single();

  if (currentErr || !currentOrder) {
    console.error("[updateOrderDeliveryStatus] Order not found:", currentErr?.message);
    throw new Error("Order not found");
  }

  const previousStatus = (currentOrder.delivery_status || "confirmed") as DeliveryStatus;

  // 2. Perform the delivery status update
  const { data, error } = await adminClient
    .from("orders")
    .update({ delivery_status: deliveryStatus })
    .eq("id", orderId)
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
      customer_id,
      created_at,
      order_items (
        id,
        order_id,
        product_id,
        product_name_snapshot,
        quantity,
        selected_colour,
        selected_size,
        unit_price,
        subtotal
      )
    `)
    .single();

  if (error || !data) {
    console.error("[updateOrderDeliveryStatus] Database error updating status:", error?.message);
    throw new Error(error?.message || "Failed to update order delivery status");
  }

  // 3. Dispatch Order Dispatched Email ONLY on confirmed -> dispatched transition
  if (previousStatus === "confirmed" && deliveryStatus === "dispatched" && data.customer_email) {
    try {
      const emailItems: OrderItemEmailPayload[] = Array.isArray(data.order_items)
        ? data.order_items.map((item: any) => ({
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

      const orderNumber =
        data.flutterwave_reference || `ORD-${data.id.slice(0, 8).toUpperCase()}`;
      const trackingNumber = data.flutterwave_reference
        ? `GIG-${data.flutterwave_reference.slice(0, 10).toUpperCase()}`
        : `GIG-ABA-${data.id.slice(0, 6).toUpperCase()}`;

      const emailResult = await sendOrderDispatchedEmail({
        customerName: data.customer_name || "Valued Customer",
        customerEmail: data.customer_email,
        orderNumber,
        deliveryAddress: data.delivery_address || "Aba Atelier Node",
        courier: "GIG Logistics / Aba Central Dispatch",
        trackingNumber,
        estimatedDelivery: "2–4 Business Days across Nigeria",
        items: emailItems,
      });

      if (!emailResult.success) {
        console.warn(
          "[updateOrderDeliveryStatus] Dispatched email notice:",
          emailResult.error
        );
      } else {
        console.log(
          "[updateOrderDeliveryStatus] Dispatched email sent successfully. ID:",
          emailResult.messageId
        );
      }
    } catch (emailErr: unknown) {
      // Safe error logging: Never roll back status or expose secrets if email delivery fails
      console.error(
        "[updateOrderDeliveryStatus] Failed to dispatch order dispatched email:",
        emailErr instanceof Error ? emailErr.message : "Unknown email error"
      );
    }
  }

  // 4. Dispatch Order In Transit Email ONLY on dispatched -> in_transit transition
  if (previousStatus === "dispatched" && deliveryStatus === "in_transit" && data.customer_email) {
    try {
      const orderNumber =
        data.flutterwave_reference || `ORD-${data.id.slice(0, 8).toUpperCase()}`;
      const trackingNumber = data.flutterwave_reference
        ? `GIG-${data.flutterwave_reference.slice(0, 10).toUpperCase()}`
        : `GIG-ABA-${data.id.slice(0, 6).toUpperCase()}`;

      const emailResult = await sendOrderInTransitEmail({
        customerName: data.customer_name || "Valued Customer",
        customerEmail: data.customer_email,
        orderNumber,
        deliveryAddress: data.delivery_address || "Aba Atelier Node",
        courier: "GIG Logistics / Aba Central Dispatch",
        trackingNumber,
        currentLocationOrUpdate: "In transit across logistics hubs toward your destination",
      });

      if (!emailResult.success) {
        console.warn(
          "[updateOrderDeliveryStatus] In-transit email notice:",
          emailResult.error
        );
      } else {
        console.log(
          "[updateOrderDeliveryStatus] In-transit email sent successfully. ID:",
          emailResult.messageId
        );
      }
    } catch (emailErr: unknown) {
      // Safe error logging: Never roll back status or expose secrets if email delivery fails
      console.error(
        "[updateOrderDeliveryStatus] Failed to dispatch in-transit email:",
        emailErr instanceof Error ? emailErr.message : "Unknown email error"
      );
    }
  }

  // 5. Dispatch Order Delivered Email ONLY on (in_transit -> delivered) or (delayed -> delivered) transition
  if (
    (previousStatus === "in_transit" || previousStatus === "delayed") &&
    deliveryStatus === "delivered" &&
    data.customer_email
  ) {
    try {
      const emailItems: OrderItemEmailPayload[] = Array.isArray(data.order_items)
        ? data.order_items.map((item: any) => ({
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

      const orderNumber =
        data.flutterwave_reference || `ORD-${data.id.slice(0, 8).toUpperCase()}`;

      const emailResult = await sendOrderDeliveredEmail({
        customerName: data.customer_name || "Valued Customer",
        customerEmail: data.customer_email,
        orderNumber,
        deliveryAddress: data.delivery_address || "Aba Atelier Node",
        deliveredAt: new Date().toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        items: emailItems,
      });

      if (!emailResult.success) {
        console.warn(
          "[updateOrderDeliveryStatus] Delivered email notice:",
          emailResult.error
        );
      } else {
        console.log(
          "[updateOrderDeliveryStatus] Delivered email sent successfully. ID:",
          emailResult.messageId
        );
      }
    } catch (emailErr: unknown) {
      // Safe error logging: Never roll back status or expose secrets if email delivery fails
      console.error(
        "[updateOrderDeliveryStatus] Failed to dispatch delivered email:",
        emailErr instanceof Error ? emailErr.message : "Unknown email error"
      );
    }
  }

  // 6. Dispatch Order Delayed Email ONLY on (dispatched -> delayed) or (in_transit -> delayed) transition
  if (
    (previousStatus === "dispatched" || previousStatus === "in_transit") &&
    deliveryStatus === "delayed" &&
    data.customer_email
  ) {
    try {
      const orderNumber =
        data.flutterwave_reference || `ORD-${data.id.slice(0, 8).toUpperCase()}`;

      const emailResult = await sendOrderDelayedEmail({
        customerName: data.customer_name || "Valued Customer",
        customerEmail: data.customer_email,
        orderNumber,
        deliveryAddress: data.delivery_address || "Aba Atelier Node",
        reason:
          "Interstate transit network delay / logistics hold. Our atelier team is closely tracking the waybill with the courier.",
        updatedEstimate: "1–2 Additional Business Days",
      });

      if (!emailResult.success) {
        console.warn(
          "[updateOrderDeliveryStatus] Delayed email notice:",
          emailResult.error
        );
      } else {
        console.log(
          "[updateOrderDeliveryStatus] Delayed email sent successfully. ID:",
          emailResult.messageId
        );
      }
    } catch (emailErr: unknown) {
      // Safe error logging: Never roll back status or expose secrets if email delivery fails
      console.error(
        "[updateOrderDeliveryStatus] Failed to dispatch delayed email:",
        emailErr instanceof Error ? emailErr.message : "Unknown email error"
      );
    }
  }

  return data as VendorOrder;
}

