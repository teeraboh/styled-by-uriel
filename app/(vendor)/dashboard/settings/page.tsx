"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Save,
  Store,
  CreditCard,
  Truck,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react";

export default function VendorSettingsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("Styled by Uriel");
  const [workshopName, setWorkshopName] = useState("Enyimba Market Hub Atelier");
  const [pickupAddress, setPickupAddress] = useState(
    "Shop 42, Block C, Enyimba Artisan Zone, Faulks Road, Aba, Abia State"
  );
  const [whatsappNumber, setWhatsappNumber] = useState("+234 703 931 5917");
  const [flutterwaveKey, setFlutterwaveKey] = useState("FLWPUBK_LIVE-884291048821-X");
  const [isGigmEnabled, setIsGigmEnabled] = useState(true);
  const [isPeaceMassEnabled, setIsPeaceMassEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Store settings & payment parameters successfully saved!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1200px] mx-auto space-y-6">
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#fff1eb] p-6 rounded-2xl border border-[#f0dfd8]/70 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#71523c]">
              Aba Merchant Administration
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f0dfd8]" />
            <span className="text-[11px] font-semibold text-[#50453e] uppercase tracking-wider">
              Live Mode
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#221a16] font-bold tracking-tight">
            Store &amp; Atelier Settings
          </h1>
          <p className="text-[14px] text-[#50453e]">
            Configure your Aba showroom pickup point, Flutterwave payment gateway, and artisan store preferences.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#f0dfd8] rounded-lg text-[12px] font-bold text-[#221a16] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#71523c]" />
            <span>Verified Aba Merchant</span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8c6a53] text-[#fff5f0] text-[12px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Workshop & Physical Pickup Point */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#f0dfd8]/70 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#f0dfd8]">
            <Store className="w-5 h-5 text-[#71523c]" />
            <h3 className="font-serif text-lg font-bold text-[#221a16]">
              Atelier &amp; Showroom Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
                Storefront Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
                Workshop Node Name
              </label>
              <input
                type="text"
                value={workshopName}
                onChange={(e) => setWorkshopName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
              Aba Physical Pickup &amp; Showroom Address
            </label>
            <textarea
              rows={2}
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
              Artisan WhatsApp Concierge Hotline
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82746d]" />
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Flutterwave Payment Gateway */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#f0dfd8]/70 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#f0dfd8]">
            <CreditCard className="w-5 h-5 text-[#71523c]" />
            <h3 className="font-serif text-lg font-bold text-[#221a16]">
              Payment Gateway Integration (Flutterwave)
            </h3>
          </div>

          <div className="p-3 bg-[#e8f5e9] rounded-xl flex items-center justify-between border border-[#c8e6c9]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse" />
              <span className="text-[13px] font-bold text-[#2e7d32]">
                Flutterwave Live Terminal Synced
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#2e7d32] uppercase font-bold">
              Auto-Settlement to Zenith Bank Aba
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#50453e]">
              Flutterwave Public Key
            </label>
            <input
              type="password"
              value={flutterwaveKey}
              onChange={(e) => setFlutterwaveKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] font-mono text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        {/* Section 3: Nationwide Logistics Carriers */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#f0dfd8]/70 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#f0dfd8]">
            <Truck className="w-5 h-5 text-[#71523c]" />
            <h3 className="font-serif text-lg font-bold text-[#221a16]">
              Nationwide Logistics Desks (Aba Terminal)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#fff1eb] border border-[#f0dfd8] flex items-center justify-between">
              <div>
                <p className="font-bold text-[13px] text-[#221a16]">GIG Logistics Aba</p>
                <p className="text-[11px] text-[#50453e]">Doorstep express dispatch (Lagos, Abuja, PH)</p>
              </div>
              <input
                type="checkbox"
                checked={isGigmEnabled}
                onChange={(e) => setIsGigmEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#71523c] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#fff1eb] border border-[#f0dfd8] flex items-center justify-between">
              <div>
                <p className="font-bold text-[13px] text-[#221a16]">Peace Mass Transit Hub</p>
                <p className="text-[11px] text-[#50453e]">Park-to-park interstate parcel desk</p>
              </div>
              <input
                type="checkbox"
                checked={isPeaceMassEnabled}
                onChange={(e) => setIsPeaceMassEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#71523c] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#8c6a53] text-[#fff5f0] text-[13px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-xs"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
