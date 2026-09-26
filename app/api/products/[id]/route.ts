import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVendorSession } from "@/lib/auth";
import { deleteProduct, getProductById, updateProduct } from "@/lib/products";

const updateProductSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    price: z.number().positive().max(10000000).optional(),
    category_id: z.string().min(1).optional(),
    availability: z.boolean().optional(),
    stock_quantity: z.number().int().nonnegative().optional(),
    images: z.array(z.string().url()).optional(),
  })
  .strict();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: { code: "not_found", message: "Product not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/products/[id]] Error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Failed to fetch product" } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getVendorSession();
    if (!session) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Unauthorized" } },
        { status: 401 }
      );
    }
    const { id } = await params;

    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "invalid_input",
            message: parsed.error.issues[0]?.message || "Invalid update payload",
          },
        },
        { status: 400 }
      );
    }

    const result = await updateProduct(id, parsed.data);
    if (result.error || !result.product) {
      return NextResponse.json(
        { error: { code: "update_failed", message: result.error || "Failed to update product" } },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: result.product }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/products/[id]] Error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Failed to update product" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getVendorSession();
    if (!session) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Unauthorized" } },
        { status: 401 }
      );
    }
    const { id } = await params;

    const result = await deleteProduct(id);
    if (!result.success) {
      return NextResponse.json(
        { error: { code: "delete_failed", message: result.error || "Failed to delete product" } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/products/[id]] Error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Failed to delete product" } },
      { status: 500 }
    );
  }
}
