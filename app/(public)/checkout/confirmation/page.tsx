"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Check, MessageCircle, Package, ArrowRight, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface OrderConfirmationPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const resolvedParams = use(searchParams);
  const orderRef = resolvedParams.ref ?? "SBU-ORDER";
  const [copied, setCopied] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear guest cart only once confirmation is reached
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy order reference:", err);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Natasha, I just placed order #${orderRef} on Styled by Uriel. Please confirm my order details.`
  );

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary-container text-secondary flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={2} />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Order Received Successfully
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-on-surface font-semibold tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-on-surface-variant text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              We&apos;ve received your order and our Aba atelier artisans will begin preparing and packaging your handcrafted garments.
            </p>
          </div>

          {/* Order Reference Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 max-w-md mx-auto shadow-sm space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-1">
                Your Order Reference Number
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 bg-surface-container-low py-2.5 px-4 rounded-xl border border-outline-variant/30">
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-on-surface tracking-wide">
                  #{orderRef}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-surface text-primary hover:bg-primary-container transition-colors shadow-2xs cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  title="Copy order reference"
                  aria-label="Copy order reference"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#2e7d32]" />
                      <span className="text-[11px] text-[#2e7d32] font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-[11px] font-bold">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
              <Package className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
              <span>Keep this reference handy for dispatch and tracking inquiries.</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <a
              href={`https://wa.me/2347039315917?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#14532D] border border-[#25D366]/30 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" strokeWidth={2} />
              <span>Contact Vendor on WhatsApp</span>
            </a>
          </div>

          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Need custom fit adjustments or direct waybill status? Connect directly with Natasha on WhatsApp anytime.
          </p>
        </div>
      </div>
    </main>
  );
}
