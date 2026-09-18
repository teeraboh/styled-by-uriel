"use client";

import { useState } from "react";
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
} from "lucide-react";

interface VendorProduct {
  id: string;
  sku: string;
  name: string;
  category: "tracksuits" | "tees" | "denim" | "shorts";
  categoryLabel: string;
  details: string;
  price: number;
  stock: number;
  maxStock: number;
  status: "Active" | "Draft" | "Low Stock";
  imageUrl: string;
}

const PRODUCTS_DATA: VendorProduct[] = [
  {
    id: "prod-1",
    sku: "SBU-TRK-01",
    name: "Signature Up & Down Tracksuit",
    category: "tracksuits",
    categoryLabel: "Tracksuits & Co-ords",
    details: "Tan / Beige • Custom Patch Details",
    price: 25000,
    stock: 8,
    maxStock: 15,
    status: "Active",
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1Uc3_GlB4S9KdmUbHXlFKrHSfWTqZU4UiKu1G91NhfnYQ4iArMUhYvNfbReEQXhuin9nLk0A6jzVC0ydJhgsDjBTYGFLkkupkq3SmicTl29NrifpGKPiBYJZLMQtERiyaOxX5bcj1yaRo5zZuL5gMS4TQGkSmP5hwfQPErw0jSgfprcKXfZZ3ImEoTHpRR7lhFUA5-Jfa5rnGGYEowGSu7NDo2ct7HOcBxfmxPBb4NKPnMT6cv-8Z7Aes0",
  },
  {
    id: "prod-2",
    sku: "SBU-TEE-04",
    name: "California Vintage Ringer Tee",
    category: "tees",
    categoryLabel: "Tees & Tops",
    details: "Cream / Navy • Retro Typography",
    price: 15000,
    stock: 18,
    maxStock: 25,
    status: "Active",
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1Vh4cGJWj_5j2IzXk_CCzajXd8wdeo17EabHyTsFT_5k8iC8MvXM1QwoMdXgvlcKXrcEqxhjReDXa04gDDNa32RZKTKmoU1uDOR6QRabneGpU8dw7M-0HaS03TzJEmTzwSDF2-O9d9n4UFSyDjZ-gqQKVKLyBzUj3Fj20-91c_-RstZMRsqgcxC-Oy1TpHfuDaZFBstZM-NsqGE6diZUoJQjAladQ5_XN2h5YU1gvRQmSMWCPkwmxVAS84",
  },
  {
    id: "prod-3",
    sku: "SBU-DNM-02",
    name: "Utility Washed Cargo Jeans",
    category: "denim",
    categoryLabel: "Denim & Cargo",
    details: "Charcoal Grey • Multi-Pocket",
    price: 22000,
    stock: 3,
    maxStock: 20,
    status: "Low Stock",
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1XvR2EwOK9GssvNZvRU3IlE7_8fe2-_TQhF1lJLdL9CeQvL8ZxHztw9XTRf8UrAn8eXjsF9K6fd6fxvaGN_suT4F_HrhID2DqSikQlkIZn9Uf6yYb1vmKxmhEr_VXAyfr6JKOaX9rgT8fZ7ETCitdLAiATD-j4cIPjA9JQfEv6YcR1KV40JkZUnSiYAY8mYLBmU_YhwRwDEim7s0yjKujVW5exDXiXVYMxov5tWfUqNb9kfI7nGYJlFn1w",
  },
  {
    id: "prod-4",
    sku: "SBU-SHT-01",
    name: "Aura Neutral Utility Shorts Set",
    category: "shorts",
    categoryLabel: "Shorts & Sets",
    details: "Warm Sand • Drawstring Waist",
    price: 18000,
    stock: 12,
    maxStock: 20,
    status: "Active",
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1UDXjfzqAqksqPYNHFa4vokcmSuTht6WSYh03W4oxuczOANXqr365M34C5t0QrgEtWqGda9mXZVAZzTB2O9YNRIuMHot95hp2qgo7W6L8eBE6HnyTX3gk8NB0nSK74SShtVRhfV4YKl3NuV6lqIdMzMDkPUKaNJEcUZcRHhgE358RsflN2sD_UpSqa40lPoI4X-bCAbFxwwM8-ckrtFDwB1-MQGm-Nicg0-Ut6mrJM-B98gBDz0kOlHtJw",
  },
];

export default function VendorProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [products, setProducts] = useState<VendorProduct[]>(PRODUCTS_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === "Active" ? "Draft" : "Active";
          showToast(`Updated "${p.name}" status to ${nextStatus}.`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
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
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#71523c]">
              Catalog Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f0dfd8]" />
            <span className="text-[11px] font-semibold text-[#50453e] uppercase tracking-wider">
              Aba Node Live
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#221a16] font-bold tracking-tight">
            Products &amp; Inventory
          </h1>
          <p className="text-[14px] text-[#50453e] max-w-2xl">
            Manage your 28 live storefront styles, inventory stock levels, and pricing synchronised with your Flutterwave terminal.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => showToast("Product catalog exported to CSV.")}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-white border border-[#f0dfd8] text-[#221a16] text-[13px] font-medium shadow-xs hover:bg-[#fceae3] transition-colors"
          >
            <Download className="w-4 h-4 text-[#71523c]" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#8c6a53] text-[#fff5f0] text-[12px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats Bento Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#fff1eb] p-4 rounded-xl flex flex-col justify-between border border-[#f0dfd8]/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
              Active SKUs
            </span>
            <Shirt className="w-4 h-4 text-[#71523c]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#221a16]">28</span>
            <span className="text-[12px] text-[#71523c] font-medium">100% In Catalogue</span>
          </div>
        </div>

        <div className="bg-[#fff1eb] p-4 rounded-xl flex flex-col justify-between border border-[#f0dfd8]/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
              Total Stock Units
            </span>
            <Package className="w-4 h-4 text-[#71523c]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#221a16]">342</span>
            <span className="text-[12px] text-[#50453e]">Across Aba Atelier</span>
          </div>
        </div>

        <div className="bg-[#fff1eb] p-4 rounded-xl flex flex-col justify-between border border-[#f0dfd8]/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ba1a1a]">
              Low Stock Warning
            </span>
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#ba1a1a]">3 Items</span>
            <span className="text-[12px] text-[#ba1a1a] font-medium">&lt; 5 units left</span>
          </div>
        </div>

        <div className="bg-[#fff1eb] p-4 rounded-xl flex flex-col justify-between border border-[#f0dfd8]/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#71523c]">
              Catalog Valuation
            </span>
            <Coins className="w-4 h-4 text-[#71523c]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#71523c]">₦6,420,000</span>
            <span className="text-[12px] text-[#50453e]">Gross Value</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#f0dfd8]/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All (28)" },
            { id: "tracksuits", label: "Tracksuits & Co-ords (12)" },
            { id: "tees", label: "Tees & Tops (8)" },
            { id: "denim", label: "Denim & Cargo (5)" },
            { id: "shorts", label: "Shorts & Sets (3)" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors shadow-2xs ${
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

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none px-3.5 py-2 bg-[#fff1eb] text-[#221a16] text-[13px] font-medium rounded-lg focus:outline-none focus:bg-white border border-[#f0dfd8]/60 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#f0dfd8]/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#fff1eb] text-[#50453e] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Product Detail</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (NGN)</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0dfd8]/40 text-[#221a16] text-[13px]">
              {filteredProducts.map((prod) => {
                const stockPct = Math.round((prod.stock / prod.maxStock) * 100);
                return (
                  <tr key={prod.id} className="hover:bg-[#fff1eb]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-lg bg-[#fceae3] overflow-hidden shrink-0 border border-[#f0dfd8] relative">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#221a16] leading-snug">{prod.name}</p>
                          <p className="text-[12px] text-[#50453e]">{prod.details}</p>
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[#82746d] mt-0.5">
                            SKU: {prod.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 bg-[#fff1eb] text-[#50453e] text-[12px] font-medium rounded-md border border-[#f0dfd8]/50">
                        {prod.categoryLabel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-serif font-bold text-[15px] text-[#221a16]">
                        ₦{prod.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#2e7d32] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                        Flutterwave Active
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#fceae3] text-[#221a16] text-[11px] font-bold">
                          <span className={`w-1.5 h-1.5 rounded-full ${prod.stock <= 4 ? "bg-[#ba1a1a]" : "bg-[#34A853]"}`} />
                          {prod.stock} in stock
                        </div>
                        <div className="w-24 bg-[#fff1eb] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${prod.stock <= 4 ? "bg-[#ba1a1a]" : "bg-[#71523c]"}`}
                            style={{ width: `${stockPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
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

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => toggleProductStatus(prod.id)}
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
