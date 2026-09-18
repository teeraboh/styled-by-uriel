"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, CheckCircle2, X } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState("Signature Up & Down Tracksuit");
  const [category, setCategory] = useState("tracksuits");
  const [price, setPrice] = useState("25000");
  const [stock, setStock] = useState("8");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage(`Product ${id} updates saved successfully!`);
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1200);
    }, 600);
  };

  const handleArchive = () => {
    if (window.confirm("Are you sure you want to archive this garment from the live catalog?")) {
      setToastMessage(`Product ${id} has been archived.`);
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1200);
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
        <span className="text-[11px] font-bold text-[#50453e] uppercase tracking-wider">
          SKU: {id}
        </span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#f0dfd8]/70 space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#221a16] font-bold tracking-tight">
            Edit Garment Style
          </h1>
          <p className="text-[14px] text-[#50453e] mt-1">
            Update inventory stock levels, price points, and details for {id}.
          </p>
        </div>

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
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
              >
                <option value="tracksuits">Tracksuits &amp; Co-ords</option>
                <option value="tees">Tees &amp; Everyday Tops</option>
                <option value="denim">Denim &amp; Cargo Jeans</option>
                <option value="shorts">Shorts &amp; Sets</option>
              </select>
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
                className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#f0dfd8]">
            <button
              type="button"
              onClick={handleArchive}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/40 text-[13px] font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Archive Style</span>
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
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#8c6a53] text-white text-[13px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? "Saving..." : "Save Updates"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
