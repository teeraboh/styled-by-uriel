"use client";

import Link from "next/link";
import { Store, Plus, Menu, LogOut, ShieldCheck } from "lucide-react";

interface VendorHeaderProps {
  onMenuToggle?: () => void;
}

export function VendorHeader({ onMenuToggle }: VendorHeaderProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-[#fff8f6]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-[#f0dfd8]/70 transition-all duration-300">
      {/* Left side brand / portal indicators */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#50453e] hover:bg-[#fceae3] transition-colors"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Vendor Portal Frame */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fedab1]/90 border border-[#e6b986] shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#795e3d]" />
          <span className="text-[#795e3d] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            Vendor Portal
          </span>
        </div>

        {/* Flutterwave Frame */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fceae3] border border-[#f0dfd8] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
          <span className="text-[12px] font-semibold text-[#50453e]">
            Flutterwave Live
          </span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View Store Frame -> links to /shop */}
        <Link
          href="/shop"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#f0dfd8] hover:bg-[#fceae3] hover:border-[#dfc3b8] text-[#221a16] text-[13px] font-semibold shadow-2xs transition-all"
        >
          <Store className="w-4 h-4 text-[#71523c]" />
          <span>View Store</span>
        </Link>

        {/* Add Product Button */}
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-[#71523c] text-white text-[12px] font-bold uppercase tracking-wider shadow-xs hover:bg-[#221a16] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">+ Add Product</span>
          <span className="sm:hidden">Add</span>
        </Link>

        {/* Vendor Profile Avatar, Name & Logout with text */}
        <div className="flex items-center gap-2 sm:gap-2.5 pl-1.5 sm:pl-2.5 border-l border-[#f0dfd8] shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#8c6a53] flex items-center justify-center text-[#fff5f0] font-bold text-xs shadow-xs">
            NE
          </div>
          <div className="text-left hidden xl:block">
            <p className="text-[13px] font-bold text-[#221a16] leading-none">
              Natasha Ezinne
            </p>
            <p className="text-[11px] text-[#50453e] mt-0.5 leading-none">
              Aba Workshop
            </p>
          </div>

          <Link
            href="/login"
            onClick={() => {
              document.cookie = "sbu_vendor_session=; path=/; max-age=0; SameSite=Lax;";
            }}
            title="Sign out of Vendor Portal"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#82746d] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/50 rounded-lg border border-transparent hover:border-[#ffdad6]/80 transition-all ml-0.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
