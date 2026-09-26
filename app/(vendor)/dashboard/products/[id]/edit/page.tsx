"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useVendorCatalogStore } from "@/store/vendor-catalog";
import { CustomSelect } from "@/components/vendor/custom-select";
import type { Category } from "@/types";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const products = useVendorCatalogStore((state) => state.products);
  const updateProductInStore = useVendorCatalogStore((state) => state.updateProduct);
  const deleteProductFromStore = useVendorCatalogStore((state) => state.deleteProduct);

  const existingProduct = products.find((p) => p.id === id || p.sku === id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(existingProduct?.name || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [price, setPrice] = useState(existingProduct ? String(existingProduct.price) : "");
  const [stock, setStock] = useState(existingProduct ? String(existingProduct.stock) : "");
  const [description, setDescription] = useState(existingProduct?.details || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch live categories & product details from backend
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Load categories
        const catRes = await fetch("/api/categories");
        if (catRes.ok) {
          const catData = await catRes.json();
          const list: Category[] = catData.categories || [];
          setCategories(list);
        }

        // Load live product by ID
        const prodRes = await fetch(`/api/products/${id}`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          const p = prodData.product;
          if (p) {
            setName(p.name);
            setSelectedCategoryId(p.category_id || p.category?.id || "");
            setPrice(String(p.price));
            setStock(String(p.stock_quantity ?? 0));
            setDescription(p.description || "");
          }
        } else if (existingProduct) {
          // Fallback to local store cache
          setName(existingProduct.name);
          setPrice(String(existingProduct.price));
          setStock(String(existingProduct.stock));
          setDescription(existingProduct.details);
        }
      } catch (err) {
        console.error("Error loading product data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id, existingProduct]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Please enter a style / garment name.");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage("Please enter a valid price greater than ₦0.");
      return;
    }

    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setErrorMessage("Please enter a valid non-negative stock quantity.");
      return;
    }

    setIsSubmitting(true);

    try {
      const matchedCategory = categories.find((c) => c.id === selectedCategoryId);

      // 1. Send PATCH to live Supabase backend API
      const patchBody: Record<string, unknown> = {
        name: trimmedName,
        price: parsedPrice,
        stock_quantity: parsedStock,
        availability: parsedStock > 0,
      };

      if (selectedCategoryId) {
        patchBody.category_id = selectedCategoryId;
      }
      if (description.trim().length >= 10) {
        patchBody.description = description.trim();
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchBody),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error?.message || "Failed to update product in database.");
        setIsSubmitting(false);
        return;
      }

      // 2. Update local store
      updateProductInStore(id, {
        name: trimmedName,
        category: (matchedCategory?.slug || "tracksuits") as "tracksuits" | "tees" | "denim" | "shorts",
        categoryLabel: matchedCategory?.name || "Boutique Garment",
        price: parsedPrice,
        stock: parsedStock,
        details: description.trim() || `${trimmedName} • Handcrafted in Aba`,
        status: parsedStock > 4 ? "Active" : parsedStock > 0 ? "Low Stock" : "Draft",
      });

      setToastMessage("Product updates saved to live Supabase database!");
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 900);
    } catch (err) {
      console.error("[EditProduct] Error updating product:", err);
      setErrorMessage("Network error updating product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (window.confirm(`Are you sure you want to permanently remove "${name || id}" from the live database?`)) {
      setIsSubmitting(true);
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
          deleteProductFromStore(id);
          setToastMessage(`Product removed from Supabase database.`);
          setTimeout(() => {
            router.push("/dashboard/products");
          }, 900);
        } else {
          setErrorMessage(data.error?.message || "Failed to delete product from database.");
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error("Delete error:", err);
        setErrorMessage("Network error deleting product.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1000px] mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#221a16] text-[#fff5f0] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#71523c] animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#34A853] shrink-0" />
          <span className="text-[13px] font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pb-3 border-b border-[#f0dfd8]/70">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#71523c] hover:text-[#221a16] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </Link>
        <span className="text-[11px] font-bold text-[#50453e] uppercase tracking-wider font-mono">
          ID: {id.slice(0, 8)}...
        </span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#f0dfd8]/70 space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#221a16] font-bold tracking-tight">
            Edit Garment Style
          </h1>
          <p className="text-[14px] text-[#50453e] mt-1">
            Update inventory stock levels, price points, and details in the live Supabase catalog.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-[13px] font-semibold flex items-center gap-2 border border-[#ba1a1a]/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
                Garment Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
                Category
              </label>
              <CustomSelect
                value={selectedCategoryId}
                onChange={(next) => setSelectedCategoryId(next)}
                options={
                  categories.length > 0
                    ? categories.map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))
                    : [{ value: "", label: isLoading ? "Loading categories..." : "Categories unavailable" }]
                }
                fullWidth
                triggerClassName="bg-[#fff1eb] border-[#f0dfd8] py-2.5 rounded-lg"
                ariaLabel="Select product category"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
                Price (NGN)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="1"
                step="any"
                className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
                Stock Units in Aba Atelier
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min="0"
                step="1"
                className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
              Garment Description &amp; Craftsmanship Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#f0dfd8]">
            <button
              type="button"
              onClick={handleArchive}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/40 text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete from Database</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/products"
                className="px-4 py-2 rounded-lg border border-[#f0dfd8] text-[#50453e] text-[13px] font-semibold hover:bg-[#fceae3] transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#8c6a53] text-white text-[13px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors disabled:opacity-60 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? "Saving to Database..." : "Save Updates"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
