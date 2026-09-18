"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ShoppingBag, X } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

const TOAST_DURATION_MS = 3200;

export function AddToCartToast() {
  const lastAdded = useCartStore((state) => state.lastAdded);
  const clearLastAdded = useCartStore((state) => state.clearLastAdded);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!lastAdded) return;

    // Animate in on the next frame, then auto-dismiss
    const raf = requestAnimationFrame(() => setVisible(true));
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, TOAST_DURATION_MS);

    return () => {
      cancelAnimationFrame(raf);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lastAdded]);

  const handleDismiss = () => {
    setVisible(false);
    clearLastAdded();
  };

  if (!lastAdded) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] w-[calc(100%-2rem)] max-w-sm"
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
      }}
      onMouseLeave={() => {
        timerRef.current = setTimeout(() => {
          setVisible(false);
        }, TOAST_DURATION_MS);
      }}
    >
      <div
        className={[
          "transform transition-all duration-300 ease-out",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        ].join(" ")}
        style={{ animation: visible ? "var(--animate-toast-in)" : undefined }}
      >
        <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant/30 p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
            <Image
              src={lastAdded.imageUrl}
              alt={lastAdded.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-primary">
              <CheckCircle className="w-4 h-4" strokeWidth={2} />
              Added to Cart
            </p>
            <p className="text-sm font-bold text-on-surface truncate">{lastAdded.name}</p>
            <p className="text-[13px] text-on-surface-variant">
              {formatNaira(lastAdded.price)} × {lastAdded.quantity}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss notification"
              className="w-6 h-6 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <Link
              href="/cart"
              onClick={handleDismiss}
              className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.75} />
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}