"use client";

import { useState } from "react";
import {
  Calendar,
  Printer,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Package,
  X,
  MapPin,
  ExternalLink,
} from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  location: string;
  phone: string;
  items: { name: string; size: string; qty: number }[];
  amount: number;
  status: "Ready for Dispatch" | "In Transit" | "Dispatched" | "Delivered";
  courier: string;
  trackingId: string;
  date: string;
}

const ORDERS_LIST: Order[] = [
  {
    id: "ORD-8492",
    customerName: "Amaka Nwosu",
    location: "Lekki Phase 1, Lagos",
    phone: "+234 803 219 4482",
    items: [{ name: "Signature Up & Down Tracksuit", size: "4-5Y", qty: 1 }],
    amount: 72000,
    status: "Ready for Dispatch",
    courier: "GIG Logistics",
    trackingId: "GIG-ABA-984210",
    date: "Today, 09:15 AM",
  },
  {
    id: "ORD-8491",
    customerName: "Emeka Obi",
    location: "GRA Phase 2, Port Harcourt",
    phone: "+234 818 493 0019",
    items: [{ name: "Utility Washed Cargo Jeans", size: "6-7Y", qty: 1 }],
    amount: 25500,
    status: "In Transit",
    courier: "Peace Mass Transit",
    trackingId: "PMT-PH-44219",
    date: "Yesterday, 04:30 PM",
  },
  {
    id: "ORD-8490",
    customerName: "Fatima Bello",
    location: "Maitama District, Abuja",
    phone: "+234 809 112 3344",
    items: [{ name: "Linen Co-ord Set", size: "2-3Y", qty: 1 }],
    amount: 20000,
    status: "Dispatched",
    courier: "GIG Logistics",
    trackingId: "GIG-ABJ-11843",
    date: "14 Mar 2026",
  },
  {
    id: "ORD-8489",
    customerName: "Chioma Adeleke",
    location: "Bodija Estate, Ibadan",
    phone: "+234 802 771 9900",
    items: [{ name: "Aura Bomber & Tee Set", size: "5-6Y", qty: 1 }],
    amount: 18500,
    status: "Delivered",
    courier: "GIG Logistics",
    trackingId: "GIG-IB-77291",
    date: "12 Mar 2026",
  },
];

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(ORDERS_LIST);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && o.status === "Ready for Dispatch") ||
      (filterStatus === "transit" && o.status === "In Transit") ||
      (filterStatus === "delivered" && (o.status === "Delivered" || o.status === "Dispatched"));
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markDispatched = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "In Transit" } : o))
    );
    setActiveModalOrder(null);
    showToast(`Order ${id} dispatched via GIG Logistics!`);
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
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#71523c]">
              Aba Central Dispatch Node
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f0dfd8]" />
            <span className="text-[11px] font-semibold text-[#50453e] uppercase tracking-wider">
              Enyimba Atelier Logistics
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#221a16] font-bold tracking-tight">
            Orders &amp; Dispatch Management
          </h1>
          <p className="text-[14px] text-[#50453e] max-w-2xl">
            Track customer payments verified by Flutterwave and manage nationwide parcel dispatches from Aba.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#f0dfd8] text-[#221a16] text-[13px] font-medium shadow-xs">
            <Calendar className="w-4 h-4 text-[#71523c]" />
            <span>March 2026</span>
          </div>
          <button
            type="button"
            onClick={() => showToast("Batch Waybills printed for all active shipments.")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8c6a53] text-[#fff5f0] text-[12px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Batch Waybills</span>
          </button>
        </div>
      </div>

      {/* Status Metric Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={`p-4 rounded-xl text-left transition-all border ${
            filterStatus === "all"
              ? "bg-[#fff1eb] border-[#71523c] shadow-xs"
              : "bg-white border-[#f0dfd8] hover:bg-[#fff1eb]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
              All Active Bookings
            </span>
            <ShoppingBag className="w-4 h-4 text-[#71523c]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#221a16]">
            {orders.length} Orders
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("pending")}
          className={`p-4 rounded-xl text-left transition-all border ${
            filterStatus === "pending"
              ? "bg-[#fff1eb] border-[#71523c] shadow-xs"
              : "bg-white border-[#f0dfd8] hover:bg-[#fff1eb]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#795e3d]">
              Ready for Dispatch
            </span>
            <Clock className="w-4 h-4 text-[#795e3d]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#795e3d]">
            {orders.filter((o) => o.status === "Ready for Dispatch").length} Orders
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("transit")}
          className={`p-4 rounded-xl text-left transition-all border ${
            filterStatus === "transit"
              ? "bg-[#fff1eb] border-[#71523c] shadow-xs"
              : "bg-white border-[#f0dfd8] hover:bg-[#fff1eb]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
              In Transit
            </span>
            <Truck className="w-4 h-4 text-[#71523c]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#221a16]">
            {orders.filter((o) => o.status === "In Transit").length} Orders
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("delivered")}
          className={`p-4 rounded-xl text-left transition-all border ${
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
            {orders.filter((o) => o.status === "Delivered" || o.status === "Dispatched").length} Completed
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#f0dfd8] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#82746d]" />
        <input
          type="text"
          placeholder="Search by order ID, customer name, destination state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-[13px] text-[#221a16] placeholder:text-[#82746d] focus:outline-none"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#f0dfd8]/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#fff1eb] text-[#50453e] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Order ID &amp; Date</th>
                <th className="py-3 px-4">Recipient &amp; Destination</th>
                <th className="py-3 px-4">Garment Items</th>
                <th className="py-3 px-4">Amount (NGN)</th>
                <th className="py-3 px-4">Courier / Waybill</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0dfd8]/40 text-[#221a16] text-[13px]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#fff1eb]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#221a16]">{order.id}</div>
                    <div className="text-[11px] text-[#50453e]">{order.date}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#221a16]">{order.customerName}</div>
                    <div className="text-[12px] text-[#50453e]">{order.location}</div>
                    <div className="text-[11px] text-[#82746d]">{order.phone}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-[#50453e] font-medium">
                        {item.name} <span className="text-[11px] text-[#71523c] font-bold">({item.size})</span>
                      </div>
                    ))}
                  </td>

                  <td className="py-3.5 px-4 font-serif font-bold text-[15px] text-[#221a16]">
                    ₦{order.amount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-[12px] font-semibold text-[#221a16]">{order.courier}</div>
                    <div className="text-[11px] font-mono text-[#71523c]">{order.trackingId}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        order.status === "Ready for Dispatch"
                          ? "bg-[#fedab1] text-[#795e3d]"
                          : order.status === "In Transit"
                          ? "bg-[#f6e5de] text-[#50453e]"
                          : "bg-[#e8f5e9] text-[#2e7d32]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {order.status === "Ready for Dispatch" ? (
                      <button
                        type="button"
                        onClick={() => setActiveModalOrder(order)}
                        className="px-3 py-1.5 rounded-md bg-[#8c6a53] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-2xs"
                      >
                        Dispatch
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Waybill manifest for ${order.id} sent to printer.`);
                        }}
                        className="px-3 py-1.5 rounded-md bg-[#fff1eb] text-[#221a16] text-[11px] font-bold uppercase tracking-wider hover:bg-[#fceae3] transition-colors border border-[#f0dfd8]"
                      >
                        Print Slip
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {activeModalOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#f0dfd8] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0dfd8]">
              <h3 className="font-serif text-xl font-bold text-[#221a16]">
                Dispatch {activeModalOrder.id}
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
                Confirm that parcel for <strong>{activeModalOrder.customerName}</strong> is packed and ready for carrier pickup.
              </p>
              <div className="p-3 bg-[#fff1eb] rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#50453e]">Courier:</span>
                  <span className="font-bold text-[#221a16]">{activeModalOrder.courier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#50453e]">Tracking ID:</span>
                  <span className="font-mono font-bold text-[#71523c]">{activeModalOrder.trackingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#50453e]">Destination:</span>
                  <span className="font-semibold text-[#221a16]">{activeModalOrder.location}</span>
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
                onClick={() => markDispatched(activeModalOrder.id)}
                className="px-4 py-2 rounded-lg bg-[#8c6a53] text-white font-bold hover:bg-[#71523c]"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
