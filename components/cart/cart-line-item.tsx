"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import type { CartItem } from "@/types";

export interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartLineItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartLineItemProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <article
      className="p-4 rounded-xl bg-surface-container-lowest shadow-sm grid grid-cols-[auto_1fr] sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 sm:gap-y-0 transition-all hover:shadow-md overflow-hidden"
      data-purpose="cart-item"
    >
      {/* Thumbnail */}
      <Link
        href={`/product/${item.slug || item.productId}`}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 shadow-sm row-span-2 sm:row-span-1 block group"
      >
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={112}
          height={112}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </Link>

      {/* Image + specs */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
          Aba Crafted
        </span>
        <h3 className="text-base sm:text-lg font-bold text-on-surface truncate">
          <Link
            href={`/product/${item.slug || item.productId}`}
            className="hover:text-primary transition-colors"
          >
            {item.name}
          </Link>
        </h3>
        {(item.selectedSize || item.selectedColour) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant">
            {item.selectedSize && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                Size: <strong className="text-on-surface">{item.selectedSize}</strong>
              </span>
            )}
            {item.selectedColour && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                Colour:{" "}
                <strong className="text-on-surface">{item.selectedColour}</strong>
              </span>
            )}
          </div>
        )}
        {/* Mobile price */}
        <div className="sm:hidden mt-0.5 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-on-surface">
            {formatNaira(lineTotal)}
          </span>
        </div>
      </div>

      {/* Stepper + price + remove */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto col-span-2 sm:col-span-1 mt-1 sm:mt-0">
        <div className="flex items-center bg-surface-container-low rounded-lg p-1 flex-shrink-0">
          <button
            aria-label="Decrease quantity"
            type="button"
            onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
            className="w-10 h-10 rounded-md flex items-center justify-center text-on-surface hover:bg-surface-container-high disabled:opacity-40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Minus className="w-4 h-4" strokeWidth={2} />
          </button>
          <span className="w-9 text-center text-base font-bold text-on-surface">
            {item.quantity}
          </span>
          <button
            aria-label="Increase quantity"
            type="button"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="w-10 h-10 rounded-md flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="hidden sm:flex flex-col items-end flex-shrink-0">
          <span className="text-lg font-extrabold text-on-surface">
            {formatNaira(lineTotal)}
          </span>
          <span className="text-xs text-on-surface-variant">
            {formatNaira(item.price)} / each
          </span>
        </div>

        <button
          aria-label={`Remove ${item.name} from cart`}
          type="button"
          onClick={onRemove}
          className="min-w-[44px] min-h-[44px] p-2 text-on-surface-variant hover:text-error rounded-lg text-[13px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors hover:bg-surface-container-high flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.75} />
          <span className="hidden md:inline">Remove</span>
        </button>
      </div>
    </article>
  );
}
