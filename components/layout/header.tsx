"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
] as const;

// Brand logo — matches the Stitch homepage screens
const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAlyxMm84VUkRZBdgBU9L7t5El-YOjk89vZqSk7FOLd8NGGoEFabaKHaO3H_w38q7J29zDkmP_fGzz--0svx3nkF8RZxe_0LxkYVQH3Ytt5JqOXSPSZ4XLT8-jPcJ99ufQOBMQpwpXo8siyeG3agg_aVR-iS_gXS3MglCF38YXYBE4x-1aikAH1mP_jBGYRUfL-9n3sIF9ClUcOPpwCmjS2xgTnH2SNrE65_iDQbHAQsT7txvncIFBX1faAR1KUTOw70w";

export interface HeaderProps {
  cartItemCount?: number;
}

export function Header({ cartItemCount }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const storeItemCount = useCartStore((state) => state.items);
  const itemCount = cartItemCount ?? (isHydrated ? storeItemCount.reduce((total, item) => total + item.quantity, 0) : 0);

  useEffect(() => {
    const id = window.setTimeout(() => setIsHydrated(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div
        className="bg-brand-warm-brown text-brand-cream text-[11px] sm:text-xs tracking-wider uppercase py-2 px-4 text-center font-medium"
        data-purpose="site-banner"
      >
        Nationwide Delivery Across Nigeria
        <span className="mx-1.5 opacity-70" aria-hidden="true">·</span>
        High Quality Kids Wear
        <span className="mx-1.5 opacity-70" aria-hidden="true">·</span>
        New Arrivals Just Dropped
      </div>

      {/* ── Main Header ── */}
      <header
        className="sticky top-0 z-40 bg-brand-cream/95 backdrop-blur-md border-b border-brand-sand transition-all"
        data-purpose="primary-navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            data-purpose="brand-logo"
          >
            <Image
              src={LOGO_URL}
              alt="Styled by Uriel - Cute Comfy Stylish"
              width={160}
              height={48}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Center Nav Links (desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide text-brand-dark-brown">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "transition-colors pb-1",
                  isActive(link.href)
                    ? "text-brand-warm-brown border-b-2 border-brand-warm-brown font-semibold"
                    : "hover:text-brand-warm-brown border-b-2 border-transparent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart with counter */}
            <Link
              href="/cart"
              aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              className="relative p-2 text-brand-dark-brown hover:text-brand-warm-brown transition-colors"
            >
              <span className="block" aria-hidden="true">
                <ShoppingCart
                  key={itemCount}
                  className="w-5 h-5"
                  strokeWidth={1.8}
                  style={itemCount > 0 ? { animation: "var(--animate-bump-in)" } : undefined}
                />
              </span>
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 right-1 bg-brand-warm-brown text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Shop Now CTA (desktop) - hidden on /shop
            We take it out when the visitor is already on the shop page. */}
            {pathname !== "/shop" && (
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-brand-warm-brown hover:bg-brand-warm-brown-dark rounded-md transition duration-200 shadow-sm"
              >
                Shop Now
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" strokeWidth={2.2} />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden p-2 text-brand-dark-brown hover:text-brand-warm-brown transition-colors"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.8} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-brand-sand",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-t-0"
          )}
        >
          <nav className="flex flex-col px-4 py-4 space-y-1 bg-brand-cream">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="py-3 px-2 text-sm font-medium text-brand-dark-brown hover:text-brand-warm-brown hover:bg-brand-ivory rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {pathname !== "/shop" && (
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-1.5 w-full px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white bg-brand-warm-brown hover:bg-brand-warm-brown-dark rounded-md transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}