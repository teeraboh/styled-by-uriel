import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVendorSession } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { listCategories, slugify } from "@/lib/products";
import { Category } from "@/types";

const createCategorySchema = z
  .object({
    name: z.string().min(2, "Category name must be at least 2 characters").max(60),
    slug: z.string().min(2).max(60).optional(),
  })
  .strict();

export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json({ categories }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/categories] Error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Failed to fetch categories" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getVendorSession();
    if (!session) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "invalid_input",
            message: parsed.error.issues[0]?.message || "Invalid category data",
          },
        },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const targetSlug = parsed.data.slug || slugify(parsed.data.name);

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: parsed.data.name,
        slug: targetSlug,
      })
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: { code: "creation_failed", message: error?.message || "Failed to create category" } },
        { status: 500 }
      );
    }

    return NextResponse.json({ category: data as Category }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/categories] Error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
