"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Store, Plus, Menu, LogOut, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

interface VendorHeaderProps {
  onMenuToggle?: () => void;
}

export function VendorHeader({ onMenuToggle }: VendorHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 z-40 flex items-center justify-between py-4 px-4 lg:px-8 bg-white border-b border-gray-100">
      {/* Left group: mobile menu + status badges (sm+) */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu button - 44px touch target */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden w-11 h-11 -ml-1 rounded-lg flex items-center justify-center text-[#50453e] hover:bg-[#fceae3] transition-colors shrink-0"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Status badges - hidden entirely on mobile */}
        <div className="hidden sm:flex flex-col gap-1 min-w-0 py-0.5">
          {/* VENDOR PORTAL */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8C6A53]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            Vendor Portal
          </span>

          {/* Flutterwave Live */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1f7a3d]">
            <span className="relative flex w-1.5 h-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34A853] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#34A853]" />
            </span>
            Flutterwave Live
          </span>
        </div>
      </div>

      {/* Right group: actions & profile - visible flex row on ALL sizes */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* View Store - hidden entirely on mobile */}
        <Link
          href="/shop"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-transparent border border-[#71523c]/40 hover:bg-[#fceae3] hover:border-[#71523c] text-[#71523c] text-[13px] font-semibold transition-all shrink-0"
        >
          <Store className="w-4 h-4" />
          View Store
        </Link>

        {/* Add Product - icon-only 44px button on mobile, label on sm+ */}
        <Link
          href="/dashboard/products/new"
          aria-label="Add Product"
          className="inline-flex items-center justify-center w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:justify-start rounded-xl sm:rounded-lg bg-[#71523c] text-white text-[12px] font-bold uppercase tracking-wider shadow-sm hover:bg-[#221a16] transition-all shrink-0"
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline-block">+ Add Product</span>
        </Link>

        {/* Profile dropdown - NE avatar is the sole user control */}
        <div ref={profileRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            aria-label="Open vendor profile menu"
            className="w-11 h-11 rounded-full bg-[#8c6a53] flex items-center justify-center text-[#fff5f0] font-bold text-xs shadow-sm hover:bg-[#71523c] transition-colors"
          >
            NE
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl bg-white shadow-xl border border-[#f0dfd8] p-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-[#f0dfd8]/70">
                <p className="text-[13px] font-bold text-[#221a16] leading-none">
                  Natasha Ezinne
                </p>
                <p className="text-[11px] text-[#50453e] mt-1 leading-none">
                  Aba Workshop
                </p>
              </div>

              <form action={logoutAction} className="w-full">
                <button
                  type="submit"
                  title="Sign out of Vendor Portal"
                  className="w-full flex items-center gap-2 px-4 py-2.5 mt-1 rounded-md text-[13px] font-semibold text-[#82746d] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}