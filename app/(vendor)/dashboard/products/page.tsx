"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Download,
  Shirt,
  Package,
  AlertTriangle,
  Coins,
  Search,
  SlidersHorizontal,
  Edit,
  Eye,
  EyeOff,
  MoreVertical,
  CheckCircle2,
  X,
  Trash2,
} from "lucide-react";
import { useVendorCatalogStore, VendorProduct } from "@/store/vendor-catalog";
import { CustomSelect } from "@/components/vendor/custom-select";

export default function VendorProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const products = useVendorCatalogStore((state) => state.products);
  const setProducts = useVendorCatalogStore((state) => state.setProducts);
  const toggleStatus = useVendorCatalogStore((state) => state.toggleStatus);
  const deleteProduct = useVendorCatalogStore((state) => state.deleteProduct);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync live products from Supabase on mount
  useEffect(() => {
    async function loadLiveProducts() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products?limit=100&includeUnavailable=true");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.products)) {
            const mapped: VendorProduct[] = data.products.map((p: any) => ({
              id: p.id,
              sku: p.slug ? p.slug.toUpperCase() : `SBU-${p.id.slice(0, 6).toUpperCase()}`,
              name: p.name,
              category: (p.category?.slug || "tracksuits") as "tracksuits" | "tees" | "denim" | "shorts",
              categoryLabel: p.category?.name || "Boutique Garment",
              details: p.description || `${p.name} • Handcrafted in Aba`,
              price: p.price,
              stock: p.stock_quantity ?? 0,
              maxStock: Math.max((p.stock_quantity ?? 0) * 2, 20),
              status: !p.availability
                ? "Draft"
                : (p.stock_quantity ?? 0) <= 4
                ? "Low Stock"
                : "Active",
              imageUrl:
                p.images?.[0]?.image_url ||
                "https://lh3.googleusercontent.com/aida/AEtjO1Uc3_GlB4S9KdmUbHXlFKrHSfWTqZU4UiKu1G91NhfnYQ4iArMUhYvNfbReEQXhuin9nLk0A6jzVC0ydJhgsDjBTYGFLkkupkq3SmicTl29NrifpGKPiBYJZLMQtERiyaOxX5bcj1yaRo5zZuL5gMS4TQGkSmP5hwfQPErw0jSgfprcKXfZZ3ImEoTHpRR7lhFUA5-Jfa5rnGGYEowGSu7NDo2ct7HOcBxfmxPBb4NKPnMT6cv-8Z7Aes0",
            }));
            setProducts(mapped);
          }
        }
      } catch (err) {
        console.error("Error loading live products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadLiveProducts();
  }, [setProducts]);

  const activeCount = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => (p.stock || 0) <= 4).length;
  const totalValuation = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);

  const tracksuitsCount = products.filter((p) => p.category === "tracksuits").length;
  const teesCount = products.filter((p) => p.category === "tees").length;
  const denimCount = products.filter((p) => p.category === "denim").length;
  const shortsCount = products.filter((p) => p.category === "shorts").length;

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === "all" || prod.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "in-stock" && prod.stock > 4) ||
      (selectedStatus === "low-stock" && prod.stock <= 4);
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleToggleStatus = async (id: string, name: string, currentStatus: string) => {
    const nextAvailability = currentStatus !== "Active";
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: nextAvailability }),
      });
      if (res.ok) {
        toggleStatus(id);
        showToast(`Visibility updated for "${name}".`);
      } else {
        const data = await res.json();
        showToast(data.error?.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      showToast("Network error updating status.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the live catalog?`)) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (res.ok) {
          deleteProduct(id);
          showToast(`Successfully removed "${name}" from Supabase database.`);
        } else {
          showToast(data.error?.message || "Failed to delete product from database.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        showToast("Network error deleting product.");
      }
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto space-y-6">
      {/* Notification Toast */}
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

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-2 border-b border-[#f0dfd8]/60">
        <div className="flex flex-col gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#71523c]">
              Catalog Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f0dfd8]" />
            <span className="text-[11px] font-semibold text-[#50453e] uppercase tracking-wider">
              Aba Node Live
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Products &amp; Inventory
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl">
              Manage your {activeCount} live storefront styles, inventory stock levels, and pricing synchronised with your Flutterwave terminal.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => showToast("Product catalog exported to CSV.")}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-3.5 py-2.5 rounded-lg bg-white border border-[#f0dfd8] text-[#221a16] text-[13px] font-medium shadow-xs hover:bg-[#fceae3] transition-colors"
          >
            <Download className="w-4 h-4 text-[#71523c]" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#8c6a53] text-[#fff5f0] text-[12px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats Bento Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#fff1eb] p-4 rounded-xl flex flex-col justify-between border border-[#f0dfd8]/60 shadow-xs">
          <div className="flex justify-between items-center w-full">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Active SKUs
            </span>
            <Shirt className="w-4 h-4 text-[#71523c] shrink-0" />
          </div>
          <div className="text-3xl font-serif font-bold text-gray-900 mt-2">{activeCount}</div>
          <div className="text-sm text-gray-500 mt-1">100% In Catalogue</div>
        </div>

        <div className="bg-[#fff1eb] p-4 rounded-xl flex flex-col justify-between border border-[#f0dfd8]/60 shadow-xs">
          <div className="flex justify-between items-center w-full">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Stock Units
            </span>
            <Package className="w-4 h-4 text-[#71523c] shrink-0" />
          </div>
          <div className="text-3xl font-serif font-bold text-gray-900 mt-2">{totalStockUnits}</div>
          <div className="text-sm text-gray-500 mt-1">Across Aba Atelier</div>
        </div>

        <div className="bg-[#fff1eb] p-4 rounded-xl flex flex-col justify-between border border-[#f0dfd8]/60 shadow-xs">
          <div className="flex justify-between items-center w-full">
            <span className="text-xs font-semibold text-[#ba1a1a] uppercase tracking-wide">
              Low Stock Warning
            </span>
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#ba1a1a] mt-2">{lowStockCount} Items</div>
          <div className="text-sm text-[#ba1a1a] mt-1">&lt; 5 units left</div>
        </div>

        <div className="bg-[#fff1eb] p-4 rounded-xl flex flex-col justify-between border border-[#f0dfd8]/60 shadow-xs">
          <div className="flex justify-between items-center w-full">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Catalog Valuation
            </span>
            <Coins className="w-4 h-4 text-[#71523c] shrink-0" />
          </div>
          <div className="text-3xl font-serif font-bold text-gray-900 mt-2">
            ₦{totalValuation.toLocaleString("en-NG")}
          </div>
          <div className="text-sm text-gray-500 mt-1">Gross Value</div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#f0dfd8]/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: `All (${activeCount})` },
            { id: "tracksuits", label: `Tracksuits & Co-ords (${tracksuitsCount})` },
            { id: "tees", label: `Tees & Tops (${teesCount})` },
            { id: "denim", label: `Denim & Cargo (${denimCount})` },
            { id: "shorts", label: `Shorts & Sets (${shortsCount})` },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`grow-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors shadow-2xs ${
                selectedCategory === cat.id
                  ? "bg-[#8c6a53] text-[#fff5f0]"
                  : "bg-[#fff1eb] text-[#50453e] hover:bg-[#fceae3] hover:text-[#221a16]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#82746d]" />
            <input
              type="text"
              placeholder="Search style name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#fff1eb] text-[#221a16] text-[13px] placeholder:text-[#82746d] rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#71523c] transition-all border border-[#f0dfd8]/60"
            />
          </div>

          <CustomSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "in-stock", label: "In Stock" },
              { value: "low-stock", label: "Low Stock" },
            ]}
            triggerClassName="bg-[#fff1eb] border-[#f0dfd8]/60"
            ariaLabel="Filter products by stock status"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#f0dfd8]/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-0 sm:min-w-[1000px]">
            <thead className="hidden sm:table-header-group">
              <tr className="bg-[#fff1eb] text-[#50453e] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Product Detail</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (NGN)</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-0 sm:divide-y divide-[#f0dfd8]/40 text-[#221a16] text-[13px]">
              {filteredProducts.map((prod) => {
                const stockPct = Math.round((prod.stock / prod.maxStock) * 100);
                return (
                  <tr
                    key={prod.id}
                    className="flex flex-col gap-3 p-4 border rounded-lg mb-4 bg-white sm:table-row sm:gap-0 sm:p-0 sm:border-0 sm:rounded-none sm:mb-0 sm:bg-transparent hover:bg-[#fff1eb]/40 transition-colors"
                  >
                    <td className="sm:table-cell sm:py-3.5 sm:px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg bg-[#fceae3] overflow-hidden shrink-0 border border-[#f0dfd8] relative">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-1 min-w-[200px]">
                          <p className="font-semibold text-gray-900 leading-snug">{prod.name}</p>
                          <p className="text-sm text-gray-500">{prod.details}</p>
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[#82746d]">
                            SKU: {prod.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="sm:table-cell sm:py-3.5 sm:px-4">
                      <span className="inline-flex items-center px-2.5 py-1 bg-[#fff1eb] text-[#50453e] text-[12px] font-medium rounded-md border border-[#f0dfd8]/50">
                        {prod.categoryLabel}
                      </span>
                    </td>

                    <td className="sm:table-cell sm:py-3.5 sm:px-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-serif font-bold text-[15px] text-[#221a16] whitespace-nowrap">
                          ₦{prod.price.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#2e7d32] font-semibold flex items-center gap-1 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] shrink-0" />
                          Flutterwave Active
                        </div>
                      </div>
                    </td>

                    <td className="sm:table-cell sm:py-3.5 sm:px-4">
                      <div className="flex flex-col gap-2 w-full max-w-[120px]">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#fceae3] text-[#221a16] text-[11px] font-bold self-start whitespace-nowrap">
                          <span className={`w-1.5 h-1.5 rounded-full ${prod.stock <= 4 ? "bg-[#ba1a1a]" : "bg-[#34A853]"}`} />
                          {prod.stock} in stock
                        </div>
                        <div className="w-full bg-[#fff1eb] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${prod.stock <= 4 ? "bg-[#ba1a1a]" : "bg-[#71523c]"}`}
                            style={{ width: `${stockPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="sm:table-cell sm:py-3.5 sm:px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          prod.status === "Active"
                            ? "bg-[#e8f5e9] text-[#2e7d32]"
                            : prod.status === "Low Stock"
                            ? "bg-[#ffdad6] text-[#ba1a1a]"
                            : "bg-[#f0dfd8] text-[#50453e]"
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>

                    <td className="flex justify-end gap-4 border-t pt-2 mt-2 sm:table-cell sm:mt-0 sm:pt-0 sm:border-t-0 sm:py-3.5 sm:px-4 sm:text-right">
                      <div className="flex items-center justify-end gap-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(prod.id, prod.name, prod.status)}
                          className="p-1.5 rounded text-[#50453e] hover:bg-[#fff1eb] hover:text-[#71523c] transition-colors"
                          title="Toggle Visibility"
                        >
                          {prod.status === "Active" ? (
                            <Eye className="w-4 h-4 text-[#2e7d32]" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-[#82746d]" />
                          )}
                        </button>
                        <Link
                          href={`/dashboard/products/${prod.id}/edit`}
                          className="p-1.5 rounded text-[#50453e] hover:bg-[#fff1eb] hover:text-[#71523c] transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded text-[#50453e] hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
