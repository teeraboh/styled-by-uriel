"use client";

import Link from "next/link";
import { ShoppingBag, Truck, ArrowLeft, Trash2, CheckCircle, BadgeCheck, RefreshCw } from "lucide-react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } =
    useCartStore();

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-ivory flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-brand-warm-brown" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-3xl text-on-surface font-semibold">
              Your bag is currently empty
            </h1>
            <p className="text-on-surface-variant text-base">
              Looks like you haven&apos;t added anything yet. Explore our
              collection to find something your little one will love.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Breadcrumb + count */}
        <div className="flex flex-row items-center justify-between pb-4 mb-6">
          <div className="flex items-center gap-2 text-[13px] font-semibold">
            <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">Cart</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[13px] font-bold uppercase tracking-wider text-on-surface-variant">
              {totalItems} {totalItems === 1 ? "Item" : "Items"} in Bag
            </span>
          </div>
        </div>

        {/* Delivery ribbon */}
        <div className="mb-8 p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
              <Truck className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-on-surface">
                Nationwide Delivery Available
              </h4>
              <p className="text-xs text-on-surface-variant">
                Delivered across Nigeria — delivery cost is calculated at
                checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column */}
          <section aria-label="Shopping Cart Items" className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <CartLineItem
                  key={`${item.productId}-${item.variationId}`}
                  item={item}
                  onUpdateQuantity={(qty) =>
                    updateQuantity(item.productId, item.variationId, qty)
                  }
                  onRemove={() => removeItem(item.productId, item.variationId)}
                />
              ))}
            </div>

            {/* Continue shopping + empty cart */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-primary hover:text-on-surface transition-colors break-words"
              >
                <ArrowLeft className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                Continue Shopping
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-error transition-colors px-2 py-1.5 rounded-md hover:bg-surface-container"
              >
                <Trash2 className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                Empty Cart
              </button>
            </div>

            {/* Assurance strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {[
                { icon: CheckCircle, title: "Child-Safe Textiles", text: "Gentle on delicate skin" },
                { icon: BadgeCheck, title: "Handcrafted in Aba", text: "Reinforced seams" },
                { icon: RefreshCw, title: "Hassle-Free Sizing", text: "Size support on WhatsApp" },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="p-4 rounded-lg bg-surface-container-low flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{title}</p>
                    <p className="text-xs text-on-surface-variant">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right column */}
          <div className="lg:col-span-4">
            <CartSummary subtotal={subtotal} itemCount={totalItems} />
          </div>
        </div>
      </div>
    </main>
  );
}
