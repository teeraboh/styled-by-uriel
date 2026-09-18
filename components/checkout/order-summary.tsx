"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { Lock, ArrowLeft, ShieldCheck, BadgeCheck, RefreshCw } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import type { CartItem } from "@/types";
import type { CheckoutFormValues } from "@/lib/validation/checkout";

export interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export function OrderSummary({ items, subtotal }: OrderSummaryProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<CheckoutFormValues>();

  return (
    <div className="space-y-4 sticky top-28">
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient">
        <div className="flex items-center justify-between pb-3 mb-4">
          <h3 className="text-lg font-bold text-on-surface">Order Summary</h3>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2 py-1 bg-surface-container-low rounded">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Line items */}
        <div className="space-y-4 pb-4 mb-4 border-b border-outline-variant/20">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variationId}`} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                <span className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-bl">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="text-sm text-on-surface truncate font-bold">{item.name}</h4>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  {item.selectedSize && item.selectedColour && <span>•</span>}
                  {item.selectedColour && <span>{item.selectedColour}</span>}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-on-surface">
                  {formatNaira(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span>Subtotal</span>
            <span className="text-on-surface font-semibold">{formatNaira(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant">
            <span>Delivery cost</span>
            <span className="text-xs italic">Calculated at checkout</span>
          </div>
        </div>

        <div className="pt-3 mt-4 border-t border-outline-variant/20 flex items-baseline justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Total Amount
          </span>
          <span className="text-[22px] font-extrabold text-on-surface tracking-tight">
            {formatNaira(subtotal)}
          </span>
        </div>

        {/* Agreement */}
        <div className="mt-5">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-0.5 accent-primary w-4 h-4"
              {...register("termsAgreed")}
            />
            <span className="text-xs text-on-surface-variant">
              I accept the Terms &amp; Conditions and confirm the delivery
              address is accurate.
            </span>
          </label>
          {errors.termsAgreed && (
            <p className="mt-1 text-xs text-error">{errors.termsAgreed.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-5 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary py-3.5 rounded-lg text-base font-bold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Lock className="w-4 h-4" strokeWidth={2} />
          {isSubmitting ? "Processing..." : `Place Order • ${formatNaira(subtotal)}`}
        </button>

        <div className="mt-4 text-center">
          <Link
            href="/cart"
            className="text-[13px] font-semibold text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Review or edit cart items
          </Link>
        </div>
      </div>

      {/* Trust badges */}
      <div className="bg-surface-container-low p-4 rounded-xl space-y-3 text-on-surface-variant text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.75} />
          <div>
            <p className="font-bold text-on-surface text-[13px]">Secure Checkout</p>
            <p className="text-[11px] text-on-surface-variant">
              Encrypted payment via Flutterwave
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.75} />
          <div>
            <p className="font-bold text-on-surface text-[13px]">Aba Artisanal Craftsmanship</p>
            <p className="text-[11px] text-on-surface-variant">
              Inspected and dispatched from Aba
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.75} />
          <div>
            <p className="font-bold text-on-surface text-[13px]">Gentle Size Exchange</p>
            <p className="text-[11px] text-on-surface-variant">
              Size support on WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
