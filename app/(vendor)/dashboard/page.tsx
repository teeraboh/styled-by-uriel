"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Download,
  CheckCircle2,
  ShoppingBag,
  Shirt,
  Truck,
  ImagePlus,
  ListFilter,
  Receipt,
  Store,
  MapPin,
  ExternalLink,
  Printer,
  X,
  PackageCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useVendorCatalogStore } from "@/store/vendor-catalog";

interface OrderItem {
  id: string;
  customerName: string;
  customerLocation: string;
  item: string;
  amount: number;
  status: "Ready to Dispatch" | "In Transit" | "Dispatched" | "Delivered";
  courier?: string;
  trackingNumber?: string;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ORD-8492",
    customerName: "Amaka Nwosu",
    customerLocation: "Lekki, Lagos",
    item: "Signature Tracksuit (4-5Y)",
    amount: 72000,
    status: "Ready to Dispatch",
    courier: "GIG Logistics",
    trackingNumber: "GIG-ABA-984210",
  },
  {
    id: "ORD-8491",
    customerName: "Emeka Obi",
    customerLocation: "Port Harcourt",
    item: "Denim Cargo Jeans (6-7Y)",
    amount: 25500,
    status: "In Transit",
    courier: "Peace Mass Transit Logistics",
    trackingNumber: "PMT-PH-44219",
  },
  {
    id: "ORD-8490",
    customerName: "Fatima Bello",
    customerLocation: "Maitama, Abuja",
    item: "Linen Co-ord Set (2-3Y)",
    amount: 20000,
    status: "Dispatched",
    courier: "GIG Logistics",
    trackingNumber: "GIG-ABJ-11843",
  },
  {
    id: "ORD-8489",
    customerName: "Chioma Adeleke",
    customerLocation: "Bodija, Ibadan",
    item: "Aura Bomber & Tee (5-6Y)",
    amount: 18500,
    status: "Delivered",
    courier: "GIG Logistics",
    trackingNumber: "GIG-IB-77291",
  },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatRangeLabel(start: string, end: string): string {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "Custom range";
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} – ${e.getDate()} ${MONTH_SHORT[s.getMonth()]} ${e.getFullYear()}`;
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} ${MONTH_SHORT[s.getMonth()]} – ${e.getDate()} ${MONTH_SHORT[e.getMonth()]} ${e.getFullYear()}`;
  }
  return `${s.getDate()} ${MONTH_SHORT[s.getMonth()]} ${s.getFullYear()} – ${e.getDate()} ${MONTH_SHORT[e.getMonth()]} ${e.getFullYear()}`;
}

export default function VendorDashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [modalType, setModalType] = useState<"dispatch" | "track" | "receipt" | "waybill" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"month" | "range">("month");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(2);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [periodLabel, setPeriodLabel] = useState("March 2026");
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPickerOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPickerOpen]);

  const products = useVendorCatalogStore((state) => state.products);
  const productsCount = products.length;
  const tracksuitsCount = products.filter((p) => p.category === "tracksuits").length;
  const teesCount = products.filter((p) => p.category === "tees").length;
  const denimCount = products.filter((p) => p.category === "denim").length;
  const shortsCount = products.filter((p) => p.category === "shorts").length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null), 3500;
    });
  };

  const handleDispatchOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "In Transit" } : o
      )
    );
    setModalType(null);
    showToast(`Order ${orderId} successfully marked as Dispatched via GIGM Aba Hub!`);
  };

  const handleDownloadLedger = () => {
    const periodHeader = periodLabel;
    const csvRows = [
      ["Styled by Uriel Atelier Ledger"],
      ["Period", periodHeader],
      ["Export Date", new Date().toISOString().slice(0, 10)],
      [""],
      ["Order ID", "Customer", "Location", "Item", "Amount (NGN)", "Status"],
      ...orders.map((o) => [
        o.id,
        o.customerName,
        o.customerLocation,
        o.item,
        String(o.amount),
        o.status,
      ]),
      [""],
      ["Gross Sales (NGN)", "3,840,000"],
      ["Completed Orders", "142"],
    ];
    const csv = csvRows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `styled-by-uriel-ledger-${periodLabel.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setModalType(null);
    showToast(`Ledger for ${periodHeader} downloaded successfully.`);
  };

  const handleSelectMonth = (monthIndex: number) => {
    setPickerMode("month");
    setSelectedMonth(monthIndex);
    setSelectedYear(selectedYear);
    setPeriodLabel(`${MONTH_NAMES[monthIndex]} ${selectedYear}`);
    setIsPickerOpen(false);
  };

  const handleApplyRange = () => {
    if (!rangeStart || !rangeEnd) {
      showToast("Select both a start and an end date.");
      return;
    }
    if (rangeEnd < rangeStart) {
      showToast("End date cannot be before the start date.");
      return;
    }
    setPeriodLabel(formatRangeLabel(rangeStart, rangeEnd));
    setPickerMode("range");
    setIsPickerOpen(false);
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

      {/* ── 1. Welcome Banner Card ── */}
      <div className="bg-[#fff1eb] p-5 sm:p-6 rounded-2xl border border-[#f0dfd8]/70 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fedab1] text-[#795e3d] text-[11px] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#71523c]" />
            <span>Enyimba Market Hub • Aba</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#221a16] font-bold tracking-tight">
            Good day, Natasha
          </h2>
          <p className="text-[14px] text-[#50453e]">
            Here is your boutique atelier sales and dispatch summary for today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setIsPickerOpen((open) => !open)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-[#221a16] text-[13px] font-medium shadow-xs hover:bg-[#fceae3] border border-[#f0dfd8] transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#71523c]" />
              <span>{periodLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#71523c]" />
            </button>

            {isPickerOpen && (
              <div className="absolute left-0 top-full mt-2 z-50 w-[calc(100vw-2rem)] max-w-[90vw] sm:w-auto sm:min-w-[17rem] max-h-[60vh] overflow-y-auto rounded-xl bg-white shadow-xl border border-[#f0dfd8] p-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex gap-1.5 mb-3">
                  <button
                    type="button"
                    onClick={() => setPickerMode("month")}
                    className={`flex-1 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      pickerMode === "month"
                        ? "bg-[#8c6a53] text-white"
                        : "bg-[#fff1eb] text-[#71523c]"
                    }`}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickerMode("range")}
                    className={`flex-1 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      pickerMode === "range"
                        ? "bg-[#8c6a53] text-white"
                        : "bg-[#fff1eb] text-[#71523c]"
                    }`}
                  >
                    Custom Range
                  </button>
                </div>

                {pickerMode === "month" ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={() => setSelectedYear((year) => year - 1)}
                        className="p-1 rounded-md text-[#71523c] hover:bg-[#fceae3]"
                        aria-label="Previous year"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[13px] font-bold text-[#221a16]">
                        {selectedYear}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedYear((year) => year + 1)}
                        className="p-1 rounded-md text-[#71523c] hover:bg-[#fceae3]"
                        aria-label="Next year"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {MONTH_NAMES.map((month, index) => (
                        <button
                          key={month}
                          type="button"
                          onClick={() => handleSelectMonth(index)}
                          className={`py-2 rounded-md text-[11px] font-semibold transition-colors ${
                            pickerMode === "month" &&
                            index === selectedMonth &&
                            periodLabel === `${month} ${selectedYear}`
                              ? "bg-[#8c6a53] text-white"
                              : "bg-[#fff1eb] text-[#221a16] hover:bg-[#fedab1]"
                          }`}
                        >
                          {month.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2.5">
                    <label className="block">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
                        Start
                      </span>
                      <input
                        type="date"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                        className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-[#f0dfd8] bg-white text-[12px] text-[#221a16] focus:outline-none focus:border-[#8c6a53]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
                        End
                      </span>
                      <input
                        type="date"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                        className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-[#f0dfd8] bg-white text-[12px] text-[#221a16] focus:outline-none focus:border-[#8c6a53]"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleApplyRange}
                      className="w-full py-2 rounded-lg bg-[#8c6a53] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors"
                    >
                      Apply Range
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleDownloadLedger}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8c6a53] text-[#fff5f0] text-[13px] font-bold hover:bg-[#71523c] transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Ledger</span>
          </button>
        </div>
      </div>

      {/* ── 2. Key Metrics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-2xl p-5 bg-white shadow-xs border border-[#f0dfd8]/70 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
              Total Revenue
            </p>
            <p className="font-serif text-2xl sm:text-3xl text-[#221a16] font-bold mt-2">
              ₦3,840,000
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[13px] text-[#2e7d32] font-semibold pt-3 border-t border-[#f0dfd8]/50">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Flutterwave Synced</span>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="rounded-2xl p-5 bg-white shadow-xs border border-[#f0dfd8]/70 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
              Completed Orders
            </p>
            <p className="font-serif text-2xl sm:text-3xl text-[#221a16] font-bold mt-2">
              142
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[13px] text-[#5e584f] font-medium pt-3 border-t border-[#f0dfd8]/50">
            <ShoppingBag className="w-4 h-4 text-[#71523c] shrink-0" />
            <span>Bespoke orders fulfilled</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="rounded-2xl p-5 bg-white shadow-xs border border-[#f0dfd8]/70 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
              Active Products
            </p>
            <p className="font-serif text-2xl sm:text-3xl text-[#221a16] font-bold mt-2">
              {productsCount} Items
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[13px] text-[#5e584f] font-medium pt-3 border-t border-[#f0dfd8]/50">
            <Shirt className="w-4 h-4 text-[#71523c] shrink-0" />
            <span>Live on store catalog</span>
          </div>
        </div>

        {/* Pending Dispatch */}
        <div className="rounded-2xl p-5 bg-white shadow-xs border border-[#f0dfd8]/70 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
              Pending Dispatch
            </p>
            <p className="font-serif text-2xl sm:text-3xl text-[#71523c] font-bold mt-2">
              4 Orders
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[13px] text-[#795e3d] font-medium pt-3 border-t border-[#f0dfd8]/50">
            <Truck className="w-4 h-4 text-[#71523c] shrink-0" />
            <span>Peace Mass &amp; GIGM station</span>
          </div>
        </div>
      </div>

      {/* ── 3. Quick Action Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Link
          href="/dashboard/products/new"
          className="p-4 rounded-xl bg-[#fff1eb] hover:bg-[#fceae3] flex items-center gap-3.5 transition-all duration-200 border border-[#f0dfd8]/60 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#71523c] shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <ImagePlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#221a16] leading-snug">
              Upload Item
            </p>
            <p className="text-[12px] text-[#50453e]">Add photo &amp; price</p>
          </div>
        </Link>

        <Link
          href="/dashboard/products"
          className="p-4 rounded-xl bg-[#fff1eb] hover:bg-[#fceae3] flex items-center gap-3.5 transition-all duration-200 border border-[#f0dfd8]/60 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#71523c] shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <ListFilter className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#221a16] leading-snug">
              Manage Products
            </p>
            <p className="text-[12px] text-[#50453e]">{productsCount} live items</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setModalType("waybill")}
          className="p-4 rounded-xl bg-[#fff1eb] hover:bg-[#fceae3] flex items-center gap-3.5 transition-all duration-200 border border-[#f0dfd8]/60 group shadow-2xs text-left w-full"
        >
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#71523c] shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#221a16] leading-snug">
              Waybill Slips
            </p>
            <p className="text-[12px] text-[#50453e]">Print pickup labels</p>
          </div>
        </button>

        <Link
          href="/contact"
          className="p-4 rounded-xl bg-[#fff1eb] hover:bg-[#fceae3] flex items-center gap-3.5 transition-all duration-200 border border-[#f0dfd8]/60 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#2e7d32] shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#221a16] leading-snug">
              Aba Showroom
            </p>
            <p className="text-[12px] text-[#2e7d32] font-semibold">Active • Enyimba Hub</p>
          </div>
        </Link>
      </div>

      {/* ── 4. Main 2-Column Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Recent Orders & Dispatch Table */}
        <div className="lg:col-span-8 rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-[#f0dfd8]/70 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0dfd8]">
            <h3 className="font-serif text-xl sm:text-2xl text-[#221a16] font-bold">
              Recent Orders &amp; Dispatch
            </h3>
            <span className="text-[12px] font-bold text-[#71523c] uppercase tracking-wider">
              Showing {orders.length} recent
            </span>
          </div>

          <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
            <table className="w-full text-left border-collapse min-w-0 sm:min-w-[620px]">
              <thead className="hidden sm:table-header-group bg-[#fff1eb] text-[#50453e] text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5 rounded-l-lg">Order &amp; Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3.5 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-0 sm:divide-y divide-[#f0dfd8]/40 text-[#221a16] text-[13px]">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="flex flex-col gap-3 p-4 border rounded-lg mb-4 bg-white sm:table-row sm:gap-0 sm:p-0 sm:border-0 sm:rounded-none sm:mb-0 sm:bg-transparent hover:bg-[#fff1eb]/50 transition-colors"
                  >
                    <td className="flex flex-col gap-2 sm:table-cell sm:py-3.5 sm:px-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-[#221a16] whitespace-nowrap">{order.id}</div>
                        <div className="sm:hidden">
                          {order.status === "Ready to Dispatch" && (
                            <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#fedab1] text-[#795e3d] text-[11px] font-bold uppercase tracking-wider">
                              Ready to Dispatch
                            </span>
                          )}
                          {order.status === "In Transit" && (
                            <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#f6e5de] text-[#50453e] text-[11px] font-bold uppercase tracking-wider">
                              In Transit
                            </span>
                          )}
                          {order.status === "Dispatched" && (
                            <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-[11px] font-bold uppercase tracking-wider">
                              Dispatched
                            </span>
                          )}
                          {order.status === "Delivered" && (
                            <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-[11px] font-bold uppercase tracking-wider">
                              Delivered
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-[12px] text-[#50453e]">
                        {order.customerName} • {order.customerLocation}
                      </div>
                    </td>
                    <td className="flex flex-col sm:table-cell sm:py-3.5 sm:px-3 text-[#50453e] font-medium">
                      {order.item}
                    </td>
                    <td className="flex flex-col sm:table-cell sm:py-3.5 sm:px-3 font-serif font-bold text-[#221a16] text-[15px]">
                      ₦{order.amount.toLocaleString()}
                    </td>
                    <td className="hidden sm:table-cell sm:py-3.5 sm:px-3">
                      {order.status === "Ready to Dispatch" && (
                        <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#fedab1] text-[#795e3d] text-[11px] font-bold uppercase tracking-wider">
                          Ready to Dispatch
                        </span>
                      )}
                      {order.status === "In Transit" && (
                        <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#f6e5de] text-[#50453e] text-[11px] font-bold uppercase tracking-wider">
                          In Transit
                        </span>
                      )}
                      {order.status === "Dispatched" && (
                        <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-[11px] font-bold uppercase tracking-wider">
                          Dispatched
                        </span>
                      )}
                      {order.status === "Delivered" && (
                        <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-[11px] font-bold uppercase tracking-wider">
                          Delivered
                        </span>
                      )}
                    </td>
                    <td className="flex flex-col sm:table-cell sm:py-3.5 sm:px-3.5 sm:text-right">
                      {order.status === "Ready to Dispatch" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalType("dispatch");
                          }}
                          className="inline-flex items-center justify-center whitespace-nowrap w-full sm:w-auto px-3 py-1.5 rounded-md bg-[#8c6a53] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-2xs"
                        >
                          Dispatch
                        </button>
                      )}
                      {order.status === "In Transit" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalType("track");
                          }}
                          className="inline-flex items-center justify-center whitespace-nowrap w-full sm:w-auto px-3 py-1.5 rounded-md bg-[#fceae3] text-[#221a16] text-[11px] font-bold uppercase tracking-wider hover:bg-[#f0dfd8] transition-colors"
                        >
                          Track GIGM
                        </button>
                      )}
                      {order.status === "Dispatched" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalType("receipt");
                          }}
                          className="inline-flex items-center justify-center whitespace-nowrap w-full sm:w-auto px-3 py-1.5 rounded-md bg-[#fceae3] text-[#221a16] text-[11px] font-bold uppercase tracking-wider hover:bg-[#f0dfd8] transition-colors"
                        >
                          Receipt
                        </button>
                      )}
                      {order.status === "Delivered" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalType("receipt");
                          }}
                          className="inline-flex items-center justify-center whitespace-nowrap w-full sm:w-auto px-3 py-1.5 rounded-md bg-[#fceae3] text-[#221a16] text-[11px] font-bold uppercase tracking-wider hover:bg-[#f0dfd8] transition-colors"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Categories & Pickup Point */}
        <div className="lg:col-span-4 space-y-4">
          {/* Products by Category Card */}
          <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-[#f0dfd8]/70 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0dfd8]">
              <h4 className="font-serif text-lg text-[#221a16] font-bold">
                Products by Category
              </h4>
              <span className="text-[11px] font-bold text-[#50453e] uppercase tracking-wider">
                {productsCount} Total
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fff1eb] border border-[#f0dfd8]/50">
                <span className="text-[13px] font-semibold text-[#221a16]">
                  Tracksuits &amp; Co-ords
                </span>
                <span className="font-serif font-bold text-[14px] text-[#71523c]">
                  {tracksuitsCount} items
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fff1eb] border border-[#f0dfd8]/50">
                <span className="text-[13px] font-semibold text-[#221a16]">
                  Tees &amp; Everyday Tops
                </span>
                <span className="font-serif font-bold text-[14px] text-[#71523c]">
                  {teesCount} items
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fff1eb] border border-[#f0dfd8]/50">
                <span className="text-[13px] font-semibold text-[#221a16]">
                  Denim &amp; Cargo Jeans
                </span>
                <span className="font-serif font-bold text-[14px] text-[#71523c]">
                  {denimCount} items
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fff1eb] border border-[#f0dfd8]/50">
                <span className="text-[13px] font-semibold text-[#221a16]">
                  Shorts &amp; Sets
                </span>
                <span className="font-serif font-bold text-[14px] text-[#71523c]">
                  {shortsCount} items
                </span>
              </div>
            </div>
          </div>

          {/* Physical Pickup Point Card */}
          <div className="rounded-2xl bg-[#fff1eb] p-5 sm:p-6 shadow-xs border border-[#f0dfd8]/70 space-y-2.5">
            <div className="flex items-center gap-2 text-[#71523c]">
              <MapPin className="w-4 h-4 text-[#71523c] shrink-0" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider">
                Physical Pickup Point
              </h4>
            </div>

            <p className="text-[14px] font-bold text-[#221a16]">
              Enyimba Market Hub, Aba Artisan Zone
            </p>

            <p className="text-[12px] text-[#50453e] leading-relaxed">
              Customers can pick up verified orders locally or via courier dispatch desk.
            </p>

            <div className="pt-2.5 flex items-center justify-between text-[13px] font-semibold border-t border-[#f0dfd8]">
              <span className="text-[#2e7d32] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                Open Mon - Sat
              </span>
              <Link
                href="/contact"
                className="text-[#71523c] hover:underline inline-flex items-center gap-1 font-bold"
              >
                Station Details
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Modals ── */}
      {modalType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#f0dfd8] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f0dfd8]">
              <h3 className="font-serif text-xl font-bold text-[#221a16]">
                {modalType === "dispatch" && `Dispatch Order ${selectedOrder?.id}`}
                {modalType === "track" && `Courier Transit: ${selectedOrder?.id}`}
                {modalType === "receipt" && `Order Summary: ${selectedOrder?.id}`}
                {modalType === "waybill" && "Print Waybill Manifest Slips"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setModalType(null);
                  setSelectedOrder(null);
                }}
                className="p-1 rounded-lg text-[#50453e] hover:bg-[#fceae3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {modalType === "dispatch" && selectedOrder && (
              <div className="space-y-4 text-[13px]">
                <p className="text-[#50453e]">
                  Confirm dispatch of order for <strong>{selectedOrder.customerName}</strong> ({selectedOrder.customerLocation}).
                </p>
                <div className="p-3 bg-[#fff1eb] rounded-xl space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#50453e]">Item:</span>
                    <span className="font-semibold text-[#221a16]">{selectedOrder.item}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#50453e]">Amount:</span>
                    <span className="font-bold text-[#71523c]">₦{selectedOrder.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#50453e]">Station:</span>
                    <span className="font-medium text-[#221a16]">GIG Logistics / Aba Station</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-lg border border-[#f0dfd8] text-[#50453e] font-semibold hover:bg-[#fceae3]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDispatchOrder(selectedOrder.id)}
                    className="px-4 py-2 rounded-lg bg-[#8c6a53] text-white font-bold hover:bg-[#71523c] flex items-center gap-1.5"
                  >
                    <PackageCheck className="w-4 h-4" />
                    Confirm Dispatch
                  </button>
                </div>
              </div>
            )}

            {modalType === "track" && selectedOrder && (
              <div className="space-y-4 text-[13px]">
                <div className="p-4 bg-[#fff1eb] rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-[#71523c] uppercase">Courier</span>
                    <span className="font-bold text-[#221a16]">{selectedOrder.courier}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-[#71523c] uppercase">Tracking #</span>
                    <span className="font-mono font-bold text-[#221a16]">{selectedOrder.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-[#71523c] uppercase">Route</span>
                    <span className="font-medium text-[#221a16]">Aba Terminal → {selectedOrder.customerLocation}</span>
                  </div>
                </div>
                <div className="space-y-2 border-l-2 border-[#71523c] pl-4 ml-2">
                  <div>
                    <p className="font-bold text-[#221a16]">Departed Enyimba Hub Aba</p>
                    <p className="text-[11px] text-[#50453e]">Today, 08:30 AM • In transit to sorting station</p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-lg bg-[#8c6a53] text-white font-bold hover:bg-[#71523c]"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {modalType === "receipt" && selectedOrder && (
              <div className="space-y-4 text-[13px]">
                <div className="p-4 bg-[#fff1eb] rounded-xl space-y-2 border border-[#f0dfd8]">
                  <div className="flex justify-between">
                    <span className="text-[#50453e]">Order Ref:</span>
                    <span className="font-bold text-[#221a16]">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#50453e]">Customer:</span>
                    <span className="font-medium text-[#221a16]">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#50453e]">Destination:</span>
                    <span className="font-medium text-[#221a16]">{selectedOrder.customerLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#50453e]">Item Ordered:</span>
                    <span className="font-medium text-[#221a16]">{selectedOrder.item}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#f0dfd8]">
                    <span className="font-bold text-[#221a16]">Total Paid:</span>
                    <span className="font-serif font-bold text-[16px] text-[#71523c]">₦{selectedOrder.amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`Waybill receipt for ${selectedOrder.id} sent to printer.`);
                      setModalType(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#8c6a53] text-white font-bold hover:bg-[#71523c] flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    Print Receipt
                  </button>
                </div>
              </div>
            )}

            {modalType === "waybill" && (
              <div className="space-y-4 text-[13px]">
                <p className="text-[#50453e]">
                  Ready to generate bulk delivery slips for all 4 pending dispatch orders.
                </p>
                <div className="p-3 bg-[#fff1eb] rounded-xl space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#50453e]">Dispatch Station:</span>
                    <span className="font-bold text-[#221a16]">Peace Mass &amp; GIGM Aba</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#50453e]">Total Parcels:</span>
                    <span className="font-bold text-[#71523c]">4 Packages</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-lg border border-[#f0dfd8] text-[#50453e] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast("4 Waybill Slips generated and ready for thermal printing.");
                      setModalType(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#8c6a53] text-white font-bold hover:bg-[#71523c] flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    Print Slips
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
