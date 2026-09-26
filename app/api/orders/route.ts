import { NextRequest, NextResponse } from "next/server";
import {
  createOrderSchema,
  createPendingOrder,
  getVendorOrders,
  OrderValidationError,
} from "@/lib/orders";
import { getVendorSession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const session = await getVendorSession();
    if (!session) {
      return NextResponse.json(
        {
          error: {
            code: "unauthorized",
            message: "Authentication required to view vendor orders",
          },
        },
        { status: 401 }
      );
    }

    const orders = await getVendorOrders();
    return NextResponse.json({ orders }, { status: 200 });
  } catch (err: unknown) {
    console.error("[GET /api/orders] Unexpected error fetching orders:", err);
    return NextResponse.json(
      {
        error: {
          code: "fetch_orders_failed",
          message: "Unable to retrieve orders at this time.",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting check (10 requests per 10 minutes per requester)
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, {
      prefix: "orders",
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
    const parsed = createOrderSchema.safeParse(json);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        {
          error: {
            code: "invalid_input",
            message: firstIssue?.message || "Invalid order request payload",
          },
        },
        { status: 400 }
      );
    }

    const result = await createPendingOrder(parsed.data);

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof OrderValidationError) {
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

    console.error("[POST /api/orders] Unexpected error creating order:", err);

    return NextResponse.json(
      {
        error: {
          code: "order_creation_failed",
          message: "Unable to process order at this time. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
