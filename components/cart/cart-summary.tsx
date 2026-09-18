import Link from "next/link";
import { Lock, MessageCircle, BadgeCheck } from "lucide-react";
import { formatNaira } from "@/lib/utils";

export interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const whatsappHref = `https://wa.me/2347039315917?text=${encodeURIComponent(
    `Hello Styled by Uriel, I would like to place my order for the items in my cart (Total: ${formatNaira(subtotal)}).`
  )}`;

  return (
    <aside
      aria-label="Order Cart Summary"
      className="p-6 rounded-xl bg-surface-container-lowest shadow-ambient flex flex-col gap-5 sticky top-32"
      data-purpose="cart-summary"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl text-on-surface tracking-tight font-semibold">
          Cart Summary
        </h2>
        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
          NGN (₦)
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-on-surface-variant">
          <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
          <span className="font-semibold text-on-surface">{formatNaira(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-on-surface-variant">
          <span>Delivery cost</span>
          <span className="text-xs italic">Calculated at checkout</span>
        </div>
        <div className="w-full h-px bg-surface-container-highest my-1" />
        <div className="flex items-baseline justify-between">
          <span className="text-base font-bold text-on-surface">Estimated total</span>
          <span className="text-[22px] font-extrabold text-on-surface tracking-tight">
            {formatNaira(subtotal)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          href="/checkout"
          className="w-full py-3.5 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary text-center rounded-lg text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          Checkout
          <Lock className="w-4 h-4" strokeWidth={2} />
        </Link>
        <a
          className="w-full py-2.5 bg-surface-container-high hover:bg-secondary-container text-on-surface hover:text-on-secondary-container text-center rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          href={whatsappHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
          Quick Order via WhatsApp
        </a>
      </div>

      <div className="flex flex-col items-center gap-2 pt-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-outline">
          Encrypted &amp; Verified Gateways
        </span>
        <span className="px-4 py-1 rounded-full bg-surface-container-high text-on-surface text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
          <BadgeCheck className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
          Powered by Flutterwave
        </span>
      </div>
    </aside>
  );
}
