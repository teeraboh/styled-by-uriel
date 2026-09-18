"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UploadCloud,
  ImagePlus,
  Plus,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("tracksuits");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["2-3Y", "4-5Y"]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSimulateUpload = () => {
    setImagePreview(
      "https://lh3.googleusercontent.com/aida/AEtjO1Uc3_GlB4S9KdmUbHXlFKrHSfWTqZU4UiKu1G91NhfnYQ4iArMUhYvNfbReEQXhuin9nLk0A6jzVC0ydJhgsDjBTYGFLkkupkq3SmicTl29NrifpGKPiBYJZLMQtERiyaOxX5bcj1yaRo5zZuL5gMS4TQGkSmP5hwfQPErw0jSgfprcKXfZZ3ImEoTHpRR7lhFUA5-Jfa5rnGGYEowGSu7NDo2ct7HOcBxfmxPBb4NKPnMT6cv-8Z7Aes0"
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !price) {
      setToastMessage("Please provide product name and price.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage("Product published live to Styled by Uriel store catalog!");
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1000px] mx-auto space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#221a16] text-[#fff5f0] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#71523c] animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#34A853] shrink-0" />
          <span className="text-[13px] font-medium">{toastMessage}</span>
          <button
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Garment Image Upload */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
              Garment Photography (Editorial Studio Shot)
            </label>
            <div
              onClick={handleSimulateUpload}
              className="border-2 border-dashed border-[#f0dfd8] hover:border-[#71523c] rounded-2xl p-6 sm:p-8 text-center bg-[#fff1eb]/40 hover:bg-[#fff1eb] transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              {imagePreview ? (
                <div className="relative w-36 h-36 rounded-xl overflow-hidden border border-[#f0dfd8] shadow-xs">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                    }}
                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-[#ba1a1a]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#71523c] shadow-2xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-[14px] text-[#221a16]">
                    Click to upload lookbook photo
                  </p>
                  <p className="text-[12px] text-[#50453e]">
                    JPG, PNG or WEBP (Max 5MB) • Studio or flat-lay shot
                  </p>
                </>
              )}
            </div>
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
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white cursor-pointer"
              >
                <option value="tracksuits">Tracksuits &amp; Co-ords</option>
                <option value="tees">Tees &amp; Everyday Tops</option>
                <option value="denim">Denim &amp; Cargo Jeans</option>
                <option value="shorts">Shorts &amp; Sets</option>
              </select>
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
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-[#8c6a53] text-white text-[13px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-xs flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Publishing...</span>
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
