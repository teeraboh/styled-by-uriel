"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Sliders,
  MessageSquare,
  BadgeCheck,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVendorCatalogStore } from "@/store/vendor-catalog";

import { logoutAction } from "@/lib/auth/actions";

interface VendorSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function VendorSidebar({ isOpen, onClose }: VendorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const productsCount = useVendorCatalogStore((state) => state.products.length);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: `Products (${productsCount})`,
      href: "/dashboard/products",
      icon: Shirt,
      active: pathname.startsWith("/dashboard/products"),
    },
    {
      label: "Orders & Dispatch",
      href: "/dashboard/orders",
      icon: ShoppingBag,
      active: pathname.startsWith("/dashboard/orders"),
    },
    {
      label: "Store Settings",
      href: "/dashboard/settings",
      icon: Sliders,
      active: pathname.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[95] lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-72 bg-[#fff1eb] z-[100] flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-in-out border-r border-[#f0dfd8]/60",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top Branding Section */}
        <div className="flex flex-col pt-5">
          <div className="px-5 pb-5 border-b border-[#f0dfd8]/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#71523c]" />
                <span className="text-[11px] font-bold text-[#71523c] tracking-widest uppercase">
                  Handcrafted in Aba
                </span>
              </div>
              {/* Close Button on Mobile */}
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1 rounded-md text-[#50453e] hover:bg-[#fceae3]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Link href="/dashboard" className="block group">
              <h1 className="font-serif text-2xl text-[#221a16] font-bold leading-tight tracking-tight group-hover:text-[#71523c] transition-colors">
                Styled by Uriel
              </h1>
            </Link>
            <p className="text-[12px] text-[#50453e] mt-1 font-normal leading-relaxed">
              Cute. Comfy. Stylish. Children&apos;s Couture
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fceae3]">
              <span className="w-2 h-2 rounded-full bg-[#71523c]" />
              <span className="text-[11px] font-bold text-[#50453e] uppercase tracking-wider">
                Enyimba Atelier Suite
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 px-3 mt-4" aria-label="Vendor navigation">
            <Link
              href="/dashboard/products/new"
              onClick={onClose}
              className="lg:hidden flex items-center justify-center gap-2 mb-2 px-3.5 py-2.5 rounded-lg bg-[#8c6a53] text-[#fff5f0] text-[13px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-xs"
            >
              <span>+ Add New Product</span>
            </Link>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] transition-all duration-200",
                    item.active
                      ? "bg-[#8c6a53] text-[#fff5f0] font-bold shadow-xs"
                      : "text-[#50453e] hover:bg-[#fceae3] hover:text-[#221a16] font-medium"
                  )}
                >
                  <Icon className={cn("w-5 h-5", item.active ? "text-[#fff5f0]" : "text-[#71523c]")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Workshop Node & Logout */}
        <div className="p-3 m-3 flex flex-col gap-2">
          {/* Workshop Node Card */}
          <div className="p-3.5 rounded-xl bg-[#f6e5de] border border-[#f0dfd8]/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#71523c] uppercase tracking-wider">
                Workshop Node
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#221a16] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[13px] font-bold text-[#221a16] mt-1.5">
              Aba Artisan Hub
            </p>
            <p className="text-[12px] text-[#50453e] mt-0.5 leading-snug">
              Accepting custom orders &amp; bespoke tailoring
            </p>
            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#f0dfd8]">
              <a
                href="https://wa.me/2347039315917"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] text-[#71523c] font-bold hover:text-[#221a16] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Hotline
              </a>
              <BadgeCheck className="w-4 h-4 text-[#82746d]" />
            </div>
          </div>

          {/* Logout Button (Server Action) */}
          <form action={logoutAction} className="w-full">
            <button
              type="submit"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors border border-[#ffdad6]/60 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
