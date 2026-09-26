import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Category, Product, ProductImage } from "@/types";

export interface GetProductsParams {
  categorySlug?: string;
  categoryId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  includeUnavailable?: boolean;
}

/**
 * Generate a URL-friendly slug from product or category name
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

/**
 * Fetch all product categories
 */
export async function listCategories(): Promise<Category[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("[listCategories] Error fetching categories:", error.message);
      return [];
    }

    return (data as Category[]) || [];
  } catch (err) {
    console.error("[listCategories] Exception:", err);
    return [];
  }
}

/**
 * Fetch products from Supabase with optional category, search, and availability filters
 */
export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  const { categorySlug, categoryId, search, limit = 50, offset = 0, includeUnavailable = false } = params;

  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (!includeUnavailable) {
      query = query.eq("availability", true);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (search && search.trim()) {
      query = query.ilike("name", `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getProducts] Error fetching products:", error.message);
      return [];
    }

    let products = (data as unknown as Product[]) || [];

    // If filtered by categorySlug, filter against joined category slug
    if (categorySlug && categorySlug !== "all") {
      products = products.filter(
        (p) => p.category?.slug.toLowerCase() === categorySlug.toLowerCase()
      );
    }

    // Sort images by sort_order
    return products.map((p) => ({
      ...p,
      images: (p.images || []).sort((a, b) => a.sort_order - b.sort_order),
    }));
  } catch (err) {
    console.error("[getProducts] Exception:", err);
    return [];
  }
}

/**
 * Fetch single product by its unique slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createServerSupabaseClient();
    let { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variations:product_variations(*)
      `)
      .eq("slug", slug)
      .single();

    // Fallback: if not found and slug is formatted as UUID, look up by ID
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if ((error || !data) && UUID_REGEX.test(slug)) {
      const fallbackResult = await supabase
        .from("products")
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          variations:product_variations(*)
        `)
        .eq("id", slug)
        .single();
      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error || !data) {
      return null;
    }

    const product = data as unknown as Product;
    if (product.images) {
      product.images.sort((a, b) => a.sort_order - b.sort_order);
    }

    return product;
  } catch (err) {
    console.error("[getProductBySlug] Exception:", err);
    return null;
  }
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variations:product_variations(*)
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    const product = data as unknown as Product;
    if (product.images) {
      product.images.sort((a, b) => a.sort_order - b.sort_order);
    }

    return product;
  } catch (err) {
    console.error("[getProductById] Exception:", err);
    return null;
  }
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category_id: string;
  stock_quantity: number;
  availability?: boolean;
  images: string[];
}

/**
 * Create a new product with images (vendor only)
 */
export async function createProduct(input: CreateProductInput): Promise<{ product: Product | null; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    let baseSlug = slugify(input.name);
    let finalSlug = baseSlug;
    let counter = 1;

    // Ensure slug uniqueness
    while (true) {
      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (!existing) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 1. Insert product record
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert({
        name: input.name,
        slug: finalSlug,
        description: input.description,
        price: input.price,
        category_id: input.category_id,
        stock_quantity: input.stock_quantity,
        availability: input.availability ?? input.stock_quantity > 0,
      })
      .select()
      .single();

    if (productError || !productData) {
      return { product: null, error: productError?.message || "Failed to create product" };
    }

    const createdProduct = productData as Product;

    // 2. Insert product image rows if provided
    if (input.images && input.images.length > 0) {
      const imageRows = input.images.map((url, idx) => ({
        product_id: createdProduct.id,
        image_url: url,
        sort_order: idx,
      }));

      const { error: imageError } = await supabase
        .from("product_images")
        .insert(imageRows);

      if (imageError) {
        console.error("[createProduct] Image insert error:", imageError.message);
      }
    }

    return { product: createdProduct };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return { product: null, error: message };
  }
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  category_id?: string;
  stock_quantity?: number;
  availability?: boolean;
  images?: string[];
}

/**
 * Update an existing product (vendor only)
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<{ product: Product | null; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) updatePayload.name = input.name;
    if (input.description !== undefined) updatePayload.description = input.description;
    if (input.price !== undefined) updatePayload.price = input.price;
    if (input.category_id !== undefined) updatePayload.category_id = input.category_id;
    if (input.stock_quantity !== undefined) {
      updatePayload.stock_quantity = input.stock_quantity;
      if (input.availability === undefined) {
        updatePayload.availability = input.stock_quantity > 0;
      }
    }
    if (input.availability !== undefined) updatePayload.availability = input.availability;

    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateError || !updatedProduct) {
      return { product: null, error: updateError?.message || "Failed to update product" };
    }

    // Replace images if specified
    if (input.images) {
      await supabase.from("product_images").delete().eq("product_id", id);
      if (input.images.length > 0) {
        const imageRows = input.images.map((url, idx) => ({
          product_id: id,
          image_url: url,
          sort_order: idx,
        }));
        await supabase.from("product_images").insert(imageRows);
      }
    }

    return { product: updatedProduct as Product };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return { product: null, error: message };
  }
}

/**
 * Delete a product by ID (vendor only)
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return { success: false, error: message };
  }
}

/**
 * Atomically decrement product stock via database RPC function
 */
export async function decrementProductStock(productId: string, quantity: number): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc("decrement_stock", {
      p_product_id: productId,
      p_quantity: quantity,
    });

    if (error) {
      console.error("[decrementProductStock] RPC error:", error.message);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("[decrementProductStock] Exception:", err);
    return false;
  }
}
