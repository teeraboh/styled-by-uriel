import { NextRequest, NextResponse } from "next/server";
import { getVendorSession } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { validateImageUpload } from "@/lib/validation/upload";

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce vendor authentication
    const session = await getVendorSession();
    if (!session) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: { code: "missing_file", message: "No image file provided in request" } },
        { status: 400 }
      );
    }

    // 3. Server-side validation (MIME, size <= 5MB, extension)
    const validation = validateImageUpload(file.size, file.type, file.name);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: { code: "invalid_file", message: validation.error || "Invalid file" } },
        { status: 400 }
      );
    }

    // 4. Sanitize file name and create unique path
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const storagePath = `products/${Date.now()}-${cleanFileName}.${fileExt}`;

    // 5. Upload to Supabase Storage
    const supabase = await createServerSupabaseClient();
    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[uploadProductImage] Storage upload error:", uploadError.message);
      return NextResponse.json(
        { error: { code: "upload_failed", message: uploadError.message } },
        { status: 500 }
      );
    }

    // 6. Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(storagePath);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/products/upload] Error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Failed to upload image" } },
      { status: 500 }
    );
  }
}
