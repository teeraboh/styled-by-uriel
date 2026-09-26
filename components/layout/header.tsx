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

const ANNOUNCEMENT_MESSAGES = [
  "Nationwide Delivery Across Nigeria",
  "High Quality Kids Wear",
  "New Arrivals Just Dropped",
] as const;

export interface HeaderProps {
  cartItemCount?: number;
}

export function Header({ cartItemCount }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const pathname = usePathname();
  const storeItemCount = useCartStore((state) => state.items);
  const itemCount = cartItemCount ?? (isHydrated ? storeItemCount.reduce((total, item) => total + item.quantity, 0) : 0);

  useEffect(() => {
    const id = window.setTimeout(() => setIsHydrated(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div
        className="bg-brand-warm-brown text-brand-cream text-[10px] sm:text-xs tracking-wider uppercase py-1.5 sm:py-2 px-3 sm:px-4 text-center font-medium leading-snug overflow-hidden"
        data-purpose="site-banner"
      >
        <div className="max-w-7xl mx-auto h-4 sm:h-4.5 flex items-center justify-center overflow-hidden">
          <span
            key={announcementIndex}
            className="inline-block animate-announcement-slide motion-reduce:animate-none"
          >
            {ANNOUNCEMENT_MESSAGES[announcementIndex]}
          </span>
        </div>
      </div>

      {/* ── Main Header ── */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-brand-sand transition-[box-shadow,background-color] duration-200 ease-out",
          isScrolled ? "bg-brand-cream shadow-[0_4px_12px_rgba(0,0,0,0.06)]" : "bg-brand-cream/95 backdrop-blur-sm"
        )}
        data-purpose="primary-navigation"
      >
        <div
          className={cn(
            "w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            isScrolled ? "h-16" : "h-16 lg:h-20"
          )}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown rounded-md"
            data-purpose="brand-logo"
          >
            <Image
              src={LOGO_URL}
              alt="Styled by Uriel · Cute Comfy Stylish"
              width={160}
              height={48}
              className="h-9 sm:h-10 lg:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Center Nav Links (desktop: lg+) */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide text-brand-dark-brown min-w-0">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown rounded-sm after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:rounded-full after:bg-brand-warm-brown after:origin-center after:scale-x-0 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive(link.href)
                    ? "text-brand-warm-brown font-semibold after:scale-x-100"
                    : "hover:text-brand-warm-brown hover:after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
            {/* Unified Cart button — min 44px comfortable touch target */}
            <Link
              href="/cart"
              aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-brand-warm-brown hover:bg-brand-warm-brown-dark hover:scale-[1.02] rounded-lg transition-all duration-200 ease-out shadow-sm active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown"
            >
              <ShoppingCart
                key={itemCount}
                className="w-4 h-4 shrink-0"
                strokeWidth={2.2}
                style={itemCount > 0 ? { animation: "var(--animate-bump-in)" } : undefined}
              />
              <span className="hidden sm:inline">Cart</span>
              <span
                aria-hidden="true"
                className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-white/20 text-[10px] font-bold"
              >
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            </Link>

            {/* Mobile / Tablet Menu Toggle (44px touch target) */}
            <button
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden w-11 h-11 rounded-lg flex items-center justify-center text-brand-dark-brown hover:text-brand-warm-brown hover:bg-brand-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 top-[calc(32px+4rem)] lg:hidden bg-black/40 backdrop-blur-xs z-40 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Navigation Drawer */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-t border-brand-sand bg-brand-cream relative z-50",
            isMobileMenuOpen ? "max-h-[calc(100dvh-5rem)] opacity-100 shadow-xl overflow-y-auto" : "max-h-0 opacity-0 border-t-0"
          )}
        >
          <nav className="flex flex-col px-4 py-4 space-y-1.5 max-w-7xl mx-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "min-h-[44px] flex items-center py-3 px-3 text-base font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown",
                  isActive(link.href)
                    ? "bg-brand-warm-brown/10 text-brand-warm-brown font-bold"
                    : "text-brand-dark-brown hover:text-brand-warm-brown hover:bg-brand-ivory"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {pathname !== "/shop" && (
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="min-h-[44px] flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider text-white bg-brand-warm-brown hover:bg-brand-warm-brown-dark rounded-lg transition duration-200 shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop The Collection
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