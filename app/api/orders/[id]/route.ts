import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVendorSession } from "@/lib/auth";
import { updateOrderDeliveryStatus } from "@/lib/orders";
import type { DeliveryStatus } from "@/types";

const updateDeliveryStatusSchema = z.object({
  deliveryStatus: z.enum(
    ["confirmed", "dispatched", "in_transit", "delayed", "delivered"],
    {
      errorMap: () => ({
        message:
          "Invalid delivery status. Allowed: confirmed, dispatched, in_transit, delayed, delivered",
      }),
    }
  ),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate vendor
    const session = await getVendorSession();
    if (!session) {
      return NextResponse.json(
        {
          error: {
            code: "unauthorized",
            message: "Authentication required to update order delivery status",
          },
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        {
          error: {
            code: "invalid_order_id",
            message: "Order ID parameter is required",
          },
        },
        { status: 400 }
      );
    }

    // 2. Validate body payload
    const body = await req.json();
    const parsed = updateDeliveryStatusSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid payload";
      return NextResponse.json(
        { error: { code: "invalid_input", message } },
        { status: 400 }
      );
    }

    const { deliveryStatus } = parsed.data;

    // 3. Persist delivery status update to Supabase
    const updatedOrder = await updateOrderDeliveryStatus(
      id,
      deliveryStatus as DeliveryStatus
    );

    return NextResponse.json(
      {
        success: true,
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[PATCH /api/orders/[id]] Error updating delivery status:", err);
    return NextResponse.json(
      {
        error: {
          code: "update_status_failed",
          message:
            err instanceof Error
              ? err.message
              : "Failed to update order delivery status",
        },
      },
      { status: 500 }
    );
  }
}
