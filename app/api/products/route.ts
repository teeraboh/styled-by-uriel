import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVendorSession } from "@/lib/auth";
import { createProduct, getProducts } from "@/lib/products";

const createProductSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000),
    price: z.number().positive("Price must be greater than zero").max(10000000),
    category_id: z.string().min(1, "Category is required"),
    availability: z.boolean().default(true),
    stock_quantity: z.number().int().nonnegative("Stock cannot be negative"),
    images: z.array(z.string().url("Must be valid URL")).min(1, "At least one image is required"),
  })
  .strict();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 50;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!, 10) : 0;
    const includeUnavailable = searchParams.get("includeUnavailable") === "true";

    const products = await getProducts({
      categorySlug,
      categoryId,
      search,
      limit,
      offset,
      includeUnavailable,
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/products] Error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Failed to fetch products" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate vendor
    const session = await getVendorSession();
    if (!session) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    // 2. Validate input
    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "invalid_input",
            message: parsed.error.issues[0]?.message || "Invalid request payload",
          },
        },
        { status: 400 }
      );
    }

    // 3. Delegate to domain function
    const result = await createProduct(parsed.data);

    if (result.error || !result.product) {
      return NextResponse.json(
        { error: { code: "creation_failed", message: result.error || "Failed to create product" } },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: result.product }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/products] Error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
