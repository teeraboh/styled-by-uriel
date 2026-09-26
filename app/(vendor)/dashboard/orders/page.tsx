"use client";

import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Printer,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  Search,
  Package,
  X,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import type { DeliveryStatus } from "@/types";

interface OrderItemDetail {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  size: string;
  colour: string | null;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: string;
  rawId: string;
  customerName: string;
  customerEmail: string;
  location: string;
  phone: string;
  items: OrderItemDetail[];
  amount: number;
  paymentStatus: string;
  deliveryStatus: DeliveryStatus;
  courier: string;
  trackingId: string;
  date: string;
  createdAt: string;
}

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

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"month" | "range">("month");

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [periodLabel, setPeriodLabel] = useState(
    `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  // Load real orders from Supabase on mount
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/orders");
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized access. Please log in as a vendor.");
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || "Failed to load orders");
      }

      const data = await res.json();
      const rawOrders = data.orders || [];

      const mappedOrders: Order[] = rawOrders.map((o: any) => {
        const orderDate = o.created_at ? new Date(o.created_at) : new Date();
        const formattedDate = orderDate.toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const formattedTime = orderDate.toLocaleTimeString("en-NG", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const items: OrderItemDetail[] = (o.order_items || []).map((item: any) => ({
          id: item.id,
          orderId: item.order_id,
          productId: item.product_id,
          name: item.product_name_snapshot || "Boutique Garment",
          size: item.selected_size || "Standard",
          colour: item.selected_colour || null,
          qty: item.quantity || 1,
          unitPrice: Number(item.unit_price) || 0,
          subtotal: Number(item.subtotal) || 0,
        }));

        const displayId = o.flutterwave_reference
          ? o.flutterwave_reference
          : `ORD-${o.id ? o.id.slice(0, 8).toUpperCase() : "UNKNOWN"}`;

        const rawDeliveryStatus = o.delivery_status as DeliveryStatus;
        const validStatuses: DeliveryStatus[] = [
          "confirmed",
          "dispatched",
          "in_transit",
          "delayed",
          "delivered",
        ];
        const deliveryStatus: DeliveryStatus = validStatuses.includes(rawDeliveryStatus)
          ? rawDeliveryStatus
          : "confirmed";

        return {
          id: displayId,
          rawId: o.id,
          customerName: o.customer_name || "Guest Customer",
          customerEmail: o.customer_email || "N/A",
          phone: o.customer_phone || "N/A",
          location: o.delivery_address || "Aba Node Dispatch",
          items,
          amount: Number(o.total_amount) || 0,
          paymentStatus: o.payment_status || "pending",
          deliveryStatus,
          courier: "GIG Logistics",
          trackingId: o.flutterwave_reference
            ? `GIG-${o.flutterwave_reference.slice(0, 10).toUpperCase()}`
            : `GIG-ABA-${o.id ? o.id.slice(0, 6).toUpperCase() : "0000"}`,
          date: `${formattedDate}, ${formattedTime}`,
          createdAt: o.created_at || new Date().toISOString(),
        };
      });

      setOrders(mappedOrders);
    } catch (err: unknown) {
      console.error("[VendorOrdersPage] Error fetching orders:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load orders from Supabase"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateDeliveryStatus = async (
    orderId: string,
    nextStatus: DeliveryStatus
  ) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryStatus: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to update delivery status");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.rawId === orderId ? { ...o, deliveryStatus: nextStatus } : o
        )
      );

      const labelMap: Record<DeliveryStatus, string> = {
        confirmed: "Confirmed",
        dispatched: "Dispatched",
        in_transit: "In Transit",
        delayed: "Delayed",
        delivered: "Delivered",
      };

      showToast(`Order marked as ${labelMap[nextStatus]}.`);
    } catch (err: unknown) {
      console.error("Error updating status:", err);
      showToast(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "confirmed" && o.deliveryStatus === "confirmed") ||
      (filterStatus === "dispatched" && o.deliveryStatus === "dispatched") ||
      (filterStatus === "transit" && o.deliveryStatus === "in_transit") ||
      (filterStatus === "delayed" && o.deliveryStatus === "delayed") ||
      (filterStatus === "delivered" && o.deliveryStatus === "delivered");

    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.deliveryStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesFilter && matchesSearch;
  });

  const handleConfirmModalDispatch = async () => {
    if (!activeModalOrder) return;
    await handleUpdateDeliveryStatus(activeModalOrder.rawId, "dispatched");
    setActiveModalOrder(null);
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

  const handlePrintBatchWaybills = () => {
    const activeShipments = orders.filter((o) => o.deliveryStatus !== "delivered");
    if (activeShipments.length === 0) {
      showToast("No active orders to export.");
      return;
    }

    const periodHeader = periodLabel;
    const printRows = [
      ["Styled by Uriel - Batch Waybill Manifest"],
      ["Period", periodHeader],
      ["Print Date", new Date().toISOString().slice(0, 10)],
      [""],
      [
        "Waybill / Order Ref",
        "Customer Name",
        "Phone",
        "Email",
        "Destination Address",
        "Items",
        "Amount (NGN)",
        "Payment Status",
        "Delivery Status",
        "Courier",
        "Order Date",
      ],
      ...activeShipments.map((o) => [
        o.id,
        o.customerName,
        o.phone,
        o.customerEmail,
        o.location,
        o.items
          .map(
            (i) =>
              `${i.name} (${i.size}${i.colour ? `/${i.colour}` : ""} x${i.qty}) - ₦${(i.subtotal || i.unitPrice * i.qty).toLocaleString()}`
          )
          .join("; "),
        String(o.amount),
        o.paymentStatus,
        o.deliveryStatus,
        o.courier,
        o.date,
      ]),
      [""],
      ["Total Active Orders", String(activeShipments.length)],
      [
        "Gross Value (NGN)",
        String(activeShipments.reduce((sum, o) => sum + o.amount, 0)),
      ],
    ];

    const csv = printRows
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
    link.download = `styled-by-uriel-waybills-${periodLabel.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(
      `Batch waybills (${activeShipments.length}) exported for ${periodHeader}.`
    );
  };

  const renderDeliveryBadge = (status: DeliveryStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#fff1eb] text-[#71523c] border border-[#f0dfd8]">
            <Clock className="w-3 h-3 text-[#71523c]" />
            Confirmed
          </span>
        );
      case "dispatched":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#fedab1] text-[#795e3d]">
            <Package className="w-3 h-3 text-[#795e3d]" />
            Dispatched
          </span>
        );
      case "in_transit":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#e0f2fe] text-[#0369a1]">
            <Truck className="w-3 h-3 text-[#0369a1]" />
            In Transit
          </span>
        );
      case "delayed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#fee2e2] text-[#b91c1c] animate-pulse">
            <AlertTriangle className="w-3 h-3 text-[#b91c1c]" />
            Delayed
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#e8f5e9] text-[#2e7d32]">
            <CheckCircle2 className="w-3 h-3 text-[#2e7d32]" />
            Delivered
          </span>
        );
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto space-y-6">
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

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-[#f0dfd8]/60">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b05a2e]">
              Aba Central Dispatch Node
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f0dfd8]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#50453e]">
              Enyimba Atelier Logistics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 tracking-tight">
            Orders &amp; Dispatch Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Live orders connected to Supabase. Track lifecycle (Confirmed → Dispatched → In Transit → Delivered), manage delays, and fulfill nationwide dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={fetchOrders}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#f0dfd8] text-[#50453e] text-[13px] font-medium shadow-xs hover:bg-[#fceae3] transition-colors disabled:opacity-50"
            title="Refresh Orders"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#71523c] ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setIsPickerOpen((open) => !open)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#f0dfd8] text-[#221a16] text-[13px] font-medium shadow-xs hover:bg-[#fceae3] transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#71523c]" />
              <span>{periodLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#71523c]" />
            </button>

            {isPickerOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 z-50 w-[calc(100vw-2rem)] max-w-[90vw] sm:w-auto sm:min-w-[17rem] max-h-[60vh] overflow-y-auto rounded-xl bg-white shadow-xl border border-[#f0dfd8] p-3 animate-in fade-in zoom-in-95 duration-150">
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
            onClick={handlePrintBatchWaybills}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg bg-[#8c6a53] text-white text-[13px] font-bold tracking-wide hover:bg-[#71523c] transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Batch Waybills</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-red-800 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Status Metric Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={`p-3.5 rounded-xl text-left transition-all border ${
            filterStatus === "all"
              ? "bg-[#fff1eb] border-[#71523c] shadow-xs"
              : "bg-white border-[#f0dfd8] hover:bg-[#fff1eb]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
              All Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-[#71523c]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#221a16]">
            {orders.length}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("confirmed")}
          className={`p-3.5 rounded-xl text-left transition-all border ${
            filterStatus === "confirmed"
              ? "bg-[#fff1eb] border-[#71523c] shadow-xs"
              : "bg-white border-[#f0dfd8] hover:bg-[#fff1eb]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#795e3d]">
              Confirmed
            </span>
            <Clock className="w-4 h-4 text-[#795e3d]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#795e3d]">
            {orders.filter((o) => o.deliveryStatus === "confirmed").length}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("transit")}
          className={`p-3.5 rounded-xl text-left transition-all border ${
            filterStatus === "transit"
              ? "bg-[#fff1eb] border-[#71523c] shadow-xs"
              : "bg-white border-[#f0dfd8] hover:bg-[#fff1eb]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0369a1]">
              In Transit
            </span>
            <Truck className="w-4 h-4 text-[#0369a1]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#0369a1]">
            {
              orders.filter(
                (o) =>
                  o.deliveryStatus === "dispatched" ||
                  o.deliveryStatus === "in_transit"
              ).length
            }
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("delayed")}
          className={`p-3.5 rounded-xl text-left transition-all border ${
            filterStatus === "delayed"
              ? "bg-[#fff1eb] border-[#71523c] shadow-xs"
              : "bg-white border-[#f0dfd8] hover:bg-[#fff1eb]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b91c1c]">
              Delayed
            </span>
            <AlertTriangle className="w-4 h-4 text-[#b91c1c]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#b91c1c]">
            {orders.filter((o) => o.deliveryStatus === "delayed").length}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("delivered")}
          className={`p-3.5 rounded-xl text-left transition-all border ${
            filterStatus === "delivered"
              ? "bg-[#fff1eb] border-[#71523c] shadow-xs"
              : "bg-white border-[#f0dfd8] hover:bg-[#fff1eb]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2e7d32]">
              Delivered
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#2e7d32]">
            {orders.filter((o) => o.deliveryStatus === "delivered").length}
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#f0dfd8] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#82746d]" />
        <input
          type="text"
          placeholder="Search by order ID, customer name, email, phone, location, product, or delivery status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-[13px] text-[#221a16] placeholder:text-[#82746d] focus:outline-none"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#f0dfd8]/70 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#8c6a53]" />
            <p className="text-sm font-medium text-[#50453e]">Loading live orders from Supabase...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#fff1eb] flex items-center justify-center text-[#71523c] mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Orders Found</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              There are currently no customer orders in the database. When guests place orders on the storefront, they will appear here.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#fff1eb] flex items-center justify-center text-[#71523c] mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Matching Orders</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              No orders matched your active filter or search query. Try clearing the search bar or changing filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-0 sm:min-w-[1000px]">
              <thead className="hidden sm:table-header-group">
                <tr className="bg-[#fff1eb] text-[#50453e] text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID &amp; Date</th>
                  <th className="py-3 px-4">Recipient &amp; Destination</th>
                  <th className="py-3 px-4">Garment Items</th>
                  <th className="py-3 px-4">Amount &amp; Payment</th>
                  <th className="py-3 px-4">Courier / Waybill</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-0 sm:divide-y sm:divide-[#f0dfd8]/40 text-[#221a16] text-[13px]">
                {filteredOrders.map((order) => {
                  const isUpdating = updatingId === order.rawId;

                  return (
                    <tr
                      key={order.rawId || order.id}
                      className="flex flex-col gap-4 p-4 mb-4 border border-gray-200 rounded-xl bg-white shadow-sm sm:table-row sm:gap-0 sm:p-0 sm:m-0 sm:border-0 sm:rounded-none sm:bg-transparent sm:shadow-none hover:bg-[#fff1eb]/40 transition-colors"
                    >
                      {/* Order ID & Date */}
                      <td className="flex items-start justify-between gap-3 sm:table-cell sm:py-3.5 sm:px-4">
                        <div className="flex flex-col">
                          <div className="font-bold text-[#221a16] whitespace-nowrap font-mono text-xs sm:text-[13px]">
                            {order.id}
                          </div>
                          <div className="text-[11px] text-[#50453e] whitespace-nowrap mt-0.5">
                            {order.date}
                          </div>
                        </div>
                        <div className="sm:hidden shrink-0">
                          {renderDeliveryBadge(order.deliveryStatus)}
                        </div>
                      </td>

                      {/* Recipient & Destination */}
                      <td className="flex flex-col gap-1 sm:table-cell sm:py-3.5 sm:px-4">
                        <span className="text-xs text-gray-500 sm:hidden font-semibold">Recipient:</span>
                        <div className="font-medium text-gray-900 whitespace-nowrap">
                          {order.customerName}
                        </div>
                        <div className="text-[12px] text-[#50453e] flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#82746d] shrink-0 mt-0.5" />
                          <span>{order.location}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#82746d]">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#82746d]" />
                            {order.phone}
                          </span>
                          {order.customerEmail && order.customerEmail !== "N/A" && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#82746d]" />
                              {order.customerEmail}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Garment Items */}
                      <td className="flex flex-col gap-1.5 sm:table-cell sm:py-3.5 sm:px-4">
                        <span className="text-xs text-gray-500 sm:hidden font-semibold">Items:</span>
                        {order.items.length === 0 ? (
                          <span className="text-xs text-gray-400 italic">No line items</span>
                        ) : (
                          order.items.map((item, i) => (
                            <div key={item.id || i} className="text-[#50453e] text-[12px]">
                              <div className="font-medium text-[#221a16]">
                                {item.name}{" "}
                                <span className="text-[11px] text-[#71523c] font-bold">
                                  ({item.size}{item.colour ? ` • ${item.colour}` : ""}) x{item.qty}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#82746d]">
                                ₦{item.unitPrice.toLocaleString()} each
                                {item.qty > 1 && (
                                  <span className="ml-1 font-semibold text-[#50453e]">
                                    (₦{item.subtotal.toLocaleString()})
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </td>

                      {/* Amount & Payment Status */}
                      <td className="flex flex-col gap-1 sm:table-cell sm:py-3.5 sm:px-4">
                        <span className="font-sans text-xs text-gray-500 font-medium sm:hidden">Amount:</span>
                        <div className="font-serif font-bold text-[15px] text-[#221a16] whitespace-nowrap">
                          ₦{order.amount.toLocaleString()}
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              order.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800"
                                : order.paymentStatus === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-600"
                                  : order.paymentStatus === "pending"
                                  ? "bg-amber-500"
                                  : "bg-gray-500"
                              }`}
                            />
                            Payment: {order.paymentStatus}
                          </span>
                        </div>
                      </td>

                      {/* Courier / Waybill */}
                      <td className="flex flex-col gap-0.5 border-t pt-3 mt-2 sm:table-cell sm:border-t-0 sm:pt-0 sm:mt-0 sm:py-3.5 sm:px-4">
                        <span className="text-xs text-gray-500 sm:hidden font-semibold">Courier:</span>
                        <div className="text-[12px] font-semibold text-[#221a16] whitespace-nowrap">
                          {order.courier}
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap font-mono">
                          {order.trackingId}
                        </div>
                      </td>

                      {/* Delivery Status */}
                      <td className="hidden sm:table-cell py-3.5 px-4">
                        {renderDeliveryBadge(order.deliveryStatus)}
                      </td>

                      {/* Lifecycle Actions */}
                      <td className="flex flex-col sm:table-cell sm:py-3.5 sm:px-4 sm:text-right">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {isUpdating ? (
                            <span className="inline-flex items-center gap-1 text-xs text-[#71523c] py-1 px-2">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Updating...
                            </span>
                          ) : (
                            <>
                              {/* 1. Confirmed -> Dispatched (Modal) */}
                              {order.deliveryStatus === "confirmed" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setActiveModalOrder(order)}
                                    className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 rounded-md bg-[#8c6a53] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-2xs"
                                  >
                                    Dispatch Parcel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDeliveryStatus(order.rawId, "delayed")}
                                    className="inline-flex items-center justify-center whitespace-nowrap px-2 py-1.5 rounded-md bg-white border border-[#f0dfd8] text-[#ba1a1a] text-[11px] font-semibold hover:bg-red-50 transition-colors"
                                    title="Mark as Delayed"
                                  >
                                    Delay
                                  </button>
                                </>
                              )}

                              {/* 2. Dispatched -> In Transit */}
                              {order.deliveryStatus === "dispatched" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDeliveryStatus(order.rawId, "in_transit")}
                                    className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 rounded-md bg-[#0369a1] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#0284c7] transition-colors shadow-2xs"
                                  >
                                    Mark In Transit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDeliveryStatus(order.rawId, "delayed")}
                                    className="inline-flex items-center justify-center whitespace-nowrap px-2 py-1.5 rounded-md bg-white border border-[#f0dfd8] text-[#ba1a1a] text-[11px] font-semibold hover:bg-red-50 transition-colors"
                                    title="Mark as Delayed"
                                  >
                                    Delay
                                  </button>
                                </>
                              )}

                              {/* 3. In Transit -> Delivered */}
                              {order.deliveryStatus === "in_transit" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDeliveryStatus(order.rawId, "delivered")}
                                    className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 rounded-md bg-[#2e7d32] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#1b5e20] transition-colors shadow-2xs"
                                  >
                                    Mark Delivered
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDeliveryStatus(order.rawId, "delayed")}
                                    className="inline-flex items-center justify-center whitespace-nowrap px-2 py-1.5 rounded-md bg-white border border-[#f0dfd8] text-[#ba1a1a] text-[11px] font-semibold hover:bg-red-50 transition-colors"
                                    title="Mark as Delayed"
                                  >
                                    Delay
                                  </button>
                                </>
                              )}

                              {/* 4. Delayed -> Resume Active Lifecycle */}
                              {order.deliveryStatus === "delayed" && (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDeliveryStatus(order.rawId, "in_transit")}
                                    className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 rounded-md bg-[#0369a1] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#0284c7] transition-colors shadow-2xs"
                                  >
                                    Resume Transit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDeliveryStatus(order.rawId, "dispatched")}
                                    className="inline-flex items-center justify-center whitespace-nowrap px-2 py-1.5 rounded-md bg-[#fff1eb] text-[#71523c] border border-[#f0dfd8] text-[11px] font-bold hover:bg-[#fceae3] transition-colors"
                                  >
                                    Dispatch
                                  </button>
                                </div>
                              )}

                              {/* 5. Delivered -> Print Slip */}
                              {order.deliveryStatus === "delivered" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    showToast(`Waybill manifest for ${order.id} sent to printer.`);
                                  }}
                                  className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 rounded-md bg-[#fff1eb] text-[#221a16] text-[11px] font-bold uppercase tracking-wider hover:bg-[#fceae3] transition-colors border border-[#f0dfd8]"
                                >
                                  Print Slip
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      {activeModalOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#f0dfd8] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0dfd8]">
              <h3 className="font-serif text-xl font-bold text-[#221a16]">
                Dispatch Order {activeModalOrder.id}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModalOrder(null)}
                className="p-1 rounded-lg text-[#50453e] hover:bg-[#fceae3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <p className="text-[#50453e]">
                Confirm that parcel for <strong>{activeModalOrder.customerName}</strong> is packed and ready for carrier dispatch. This advances the order from <strong>Confirmed</strong> to <strong>Dispatched</strong>.
              </p>
              <div className="p-3 bg-[#fff1eb] rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#50453e]">Courier:</span>
                  <span className="font-bold text-[#221a16]">{activeModalOrder.courier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#50453e]">Tracking / Waybill ID:</span>
                  <span className="font-mono font-bold text-[#71523c]">{activeModalOrder.trackingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#50453e]">Phone:</span>
                  <span className="font-semibold text-[#221a16]">{activeModalOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#50453e]">Destination:</span>
                  <span className="font-semibold text-[#221a16] text-right max-w-[220px]">{activeModalOrder.location}</span>
                </div>
                <div className="pt-2 border-t border-[#f0dfd8]/60">
                  <span className="text-xs font-bold text-[#50453e] uppercase tracking-wider block mb-1">
                    Items Snapshot:
                  </span>
                  {activeModalOrder.items.map((i, idx) => (
                    <div key={idx} className="text-xs text-[#221a16] flex justify-between">
                      <span>{i.name} ({i.size}{i.colour ? ` • ${i.colour}` : ""})</span>
                      <span className="font-semibold">x{i.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalOrder(null)}
                className="px-4 py-2 rounded-lg border border-[#f0dfd8] text-[#50453e] font-semibold hover:bg-[#fceae3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmModalDispatch}
                disabled={updatingId === activeModalOrder.rawId}
                className="px-4 py-2 rounded-lg bg-[#8c6a53] text-white font-bold hover:bg-[#71523c] disabled:opacity-50 flex items-center gap-1.5"
              >
                {updatingId === activeModalOrder.rawId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Confirm Dispatch"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
