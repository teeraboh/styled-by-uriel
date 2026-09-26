"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UploadCloud,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useVendorCatalogStore } from "@/store/vendor-catalog";
import { CustomSelect } from "@/components/vendor/custom-select";
import type { Category } from "@/types";

const DEFAULT_FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida/AEtjO1Uc3_GlB4S9KdmUbHXlFKrHSfWTqZU4UiKu1G91NhfnYQ4iArMUhYvNfbReEQXhuin9nLk0A6jzVC0ydJhgsDjBTYGFLkkupkq3SmicTl29NrifpGKPiBYJZLMQtERiyaOxX5bcj1yaRo5zZuL5gMS4TQGkSmP5hwfQPErw0jSgfprcKXfZZ3ImEoTHpRR7lhFUA5-Jfa5rnGGYEowGSu7NDo2ct7HOcBxfmxPBb4NKPnMT6cv-8Z7Aes0";

const MAX_IMAGES = 4;

interface ImageSlot {
  id: string;
  url: string;
  isUploading?: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const addProductToStore = useVendorCatalogStore((state) => state.addProduct);

  // Form states
  const [productName, setProductName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["2-3Y", "4-5Y"]);
  
  // Up to 4 product images (Main Image = images[0])
  const [images, setImages] = useState<ImageSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch live categories from Supabase on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoadingCategories(true);
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          const list: Category[] = data.categories || [];
          setCategories(list);
          if (list.length > 0) {
            setSelectedCategoryId(list[0].id);
          }
        } else {
          console.error("Failed to load categories from backend API");
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Reset file input value so same files can be re-selected if needed
    e.target.value = "";

    setErrorMessage(null);

    const availableSlots = MAX_IMAGES - images.length;
    if (availableSlots <= 0) {
      setErrorMessage(`Maximum of ${MAX_IMAGES} product images allowed.`);
      return;
    }

    const filesToUpload = selectedFiles.slice(0, availableSlots);

    // Create temporary image slots with local preview URLs
    const newSlots: ImageSlot[] = filesToUpload.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      isUploading: true,
    }));

    setImages((prev) => [...prev, ...newSlots]);

    // Upload each file to Supabase Storage via /api/products/upload
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const slotId = newSlots[i].id;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/products/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          setImages((prev) =>
            prev.map((slot) =>
              slot.id === slotId ? { ...slot, url: data.url, isUploading: false } : slot
            )
          );
          setToastMessage("Lookbook photo uploaded to Aba Atelier storage!");
          setTimeout(() => setToastMessage(null), 3000);
        } else {
          const msg = data?.error?.message || "Storage upload failed. Local preview preserved.";
          console.warn("Storage upload notice:", msg);
          setImages((prev) =>
            prev.map((slot) =>
              slot.id === slotId ? { ...slot, isUploading: false } : slot
            )
          );
        }
      } catch (err) {
        console.error("Upload error:", err);
        setImages((prev) =>
          prev.map((slot) =>
            slot.id === slotId ? { ...slot, isUploading: false } : slot
          )
        );
      }
    }
  };

  const removeImage = (idToRemove: string) => {
    setImages((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = productName.trim();
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

    if (!selectedCategoryId) {
      setErrorMessage("Please select a product category.");
      return;
    }

    if (images.length === 0) {
      setErrorMessage("Please upload at least 1 image (Main Cover Image).");
      return;
    }

    if (images.some((img) => img.isUploading)) {
      setErrorMessage("Please wait for all photos to finish uploading before publishing.");
      return;
    }

    const finalDescription =
      description.trim().length >= 10
        ? description.trim()
        : `${trimmedName} handcrafted in Enyimba Atelier, Aba.`;

    const finalImageUrls = images.map((img) => img.url);

    setIsSubmitting(true);

    try {
      // 1. Submit to live backend API (POST /api/products)
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          description: finalDescription,
          price: parsedPrice,
          category_id: selectedCategoryId,
          availability: parsedStock > 0,
          stock_quantity: parsedStock,
          images: finalImageUrls,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMessage("Session expired. Please log in again as vendor.");
          router.push("/login?from=/dashboard/products/new");
          return;
        }

        setErrorMessage(
          data.error?.message || "Failed to create product. Please check your details."
        );
        setIsSubmitting(false);
        return;
      }

      // 2. Identify the category metadata for the store
      const matchedCategory = categories.find((c) => c.id === selectedCategoryId);
      const categorySlug = (matchedCategory?.slug || "tracksuits") as "tracksuits" | "tees" | "denim" | "shorts";

      // 3. Update the client Zustand store so dashboard lists and counters update immediately
      addProductToStore({
        name: trimmedName,
        category: categorySlug,
        price: parsedPrice,
        stock: parsedStock,
        description: finalDescription,
        imageUrl: finalImageUrls[0] || DEFAULT_FALLBACK_IMAGE,
      });

      setToastMessage("Product published live to Supabase database!");
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 900);
    } catch (err) {
      console.error("[NewProduct] Error submitting product:", err);
      setErrorMessage("Network error connecting to backend. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnyUploading = images.some((img) => img.isUploading);

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

      {/* Back Button & Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#f0dfd8]/70">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#71523c] hover:text-[#221a16] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </Link>
        <span className="text-[11px] font-bold text-[#50453e] uppercase tracking-wider">
          Aba Atelier Creation Desk
        </span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#f0dfd8]/70 space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#221a16] font-bold tracking-tight">
            Add New Boutique Garment
          </h1>
          <p className="text-[14px] text-[#50453e] mt-1">
            Publish handcrafted kids wear directly to your live storefront and Aba dispatch station.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-[13px] font-semibold flex items-center gap-2 border border-[#ba1a1a]/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Garment Image Upload (Up to 4 images) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
                Garment Photography ({images.length}/4 Photos)
              </label>
              <span className="text-[11px] text-[#71523c] font-semibold">
                Photo 1 is Main Cover • Up to 3 additional angles
              </span>
            </div>

            <input
              type="file"
              id="product-photo-upload"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={images.length >= MAX_IMAGES}
            />

            {/* 4-Image Slot Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[0, 1, 2, 3].map((slotIdx) => {
                const img = images[slotIdx];
                const isMain = slotIdx === 0;

                if (img) {
                  return (
                    <div
                      key={img.id}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border shadow-xs group bg-[#fceae3] ${
                        isMain ? "border-[#8c6a53] ring-2 ring-[#8c6a53]/20" : "border-[#f0dfd8]"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Product Photo ${slotIdx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Badge */}
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                          isMain
                            ? "bg-[#8c6a53] text-white"
                            : "bg-[#221a16]/80 text-white backdrop-blur-xs"
                        }`}
                      >
                        {isMain ? "Main Image" : `Angle ${slotIdx}`}
                      </span>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-white text-[#ba1a1a] rounded-full shadow-xs transition-transform hover:scale-110 cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Uploading Spinner */}
                      {img.isUploading && (
                        <div className="absolute inset-0 bg-[#221a16]/60 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 text-white">
                          <Loader2 className="w-5 h-5 animate-spin text-[#fedab1]" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider">
                            Uploading...
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }

                // Empty Slot
                return (
                  <div
                    key={`empty-slot-${slotIdx}`}
                    onClick={() => {
                      if (images.length < MAX_IMAGES) {
                        const el = document.getElementById("product-photo-upload");
                        if (el) el.click();
                      }
                    }}
                    className={`aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer ${
                      slotIdx === images.length
                        ? isMain
                          ? "border-[#8c6a53] bg-[#fff1eb]/60 hover:bg-[#fff1eb]"
                          : "border-[#f0dfd8] hover:border-[#71523c] bg-[#fff1eb]/30 hover:bg-[#fff1eb]"
                        : "border-[#f0dfd8]/60 bg-[#fff1eb]/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#71523c] shadow-2xs mb-2">
                      {isMain ? (
                        <UploadCloud className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                    <p className="font-bold text-[12px] text-[#221a16] leading-tight">
                      {isMain ? "Main Photo *" : `Additional ${slotIdx}`}
                    </p>
                    <p className="text-[10px] text-[#50453e] mt-0.5">
                      {isMain ? "Required Cover" : "Optional Angle"}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-[#50453e]">
              JPG, PNG or WEBP (Max 5MB each) • Studio, flat-lay, or detail craftsmanship shots.
            </p>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
                Style / Garment Name
              </label>
              <input
                type="text"
                placeholder="e.g. Signature Up & Down Tracksuit"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
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
                    : [
                        { value: "", label: isLoadingCategories ? "Loading categories..." : "No categories found" },
                      ]
                }
                fullWidth
                triggerClassName="bg-[#fff1eb] border-[#f0dfd8] py-2.5 rounded-lg"
                ariaLabel="Select product category"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
                Price (NGN)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71523c] font-bold">
                  ₦
                </span>
                <input
                  type="number"
                  placeholder="25000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="1"
                  step="any"
                  className="w-full pl-8 pr-4 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
                Available Units in Stock
              </label>
              <input
                type="number"
                placeholder="10"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min="0"
                step="1"
                className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Available Sizes */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
              Available Age Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                    selectedSizes.includes(sz)
                      ? "bg-[#8c6a53] text-[#fff5f0] shadow-xs"
                      : "bg-[#fff1eb] text-[#50453e] hover:bg-[#fceae3]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
              Garment Description &amp; Craftsmanship Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Heavy cotton fleece jacket with matching patch joggers and relaxed ribbed collar handcrafted in Aba."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0dfd8]">
            <Link
              href="/dashboard/products"
              className="px-5 py-2.5 rounded-lg border border-[#f0dfd8] text-[#50453e] text-[13px] font-semibold hover:bg-[#fff1eb]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isAnyUploading}
              className="px-6 py-2.5 rounded-lg bg-[#8c6a53] text-white text-[13px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Publishing to Database...</span>
              ) : isAnyUploading ? (
                <span>Uploading Photos...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publish Style Live</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
