"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export interface ShopProductCardProps {
  /** Product slug for the detail page link */
  slug: string;
  /** Product name */
  name: string;
  /** Price in Naira */
  price: number;
  /** Primary image URL */
  imageUrl: string;
  /** Short collection/category tag shown above the title */
  categoryLabel: string;
  /** One-to-two line description */
  description: string;
  /** Available age range label (e.g. "4Y - 10Y") */
  ages?: string;
  /** Optional neutral badge (e.g. "New Arrival") */
  badge?: string;
}

export function ShopProductCard({
  slug,
  name,
  price,
  imageUrl,
  categoryLabel,
  description,
  ages,
  badge,
}: ShopProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleQuickAdd = () => {
    addItem({
      productId: slug,
      name,
      price,
      quantity: 1,
      imageUrl,
      selectedColour: null,
      selectedSize: null,
      variationId: null,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article
      className="group flex flex-col bg-surface-container-lowest rounded-2xl p-4 shadow-ambient hover:shadow-xl transition-all duration-300"
      data-purpose="shop-product-card"
    >
      {/* Image frame */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low mb-4">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {badge && (
          <span className="absolute top-3 left-3 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-sm">
            {badge}
          </span>
        )}

        {ages && (
          <div className="absolute bottom-3 left-3 bg-surface/85 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-on-surface">
            Ages: <span className="font-bold">{ages}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between gap-2 text-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            {categoryLabel}
          </span>
          <h2 className="text-lg font-bold text-on-surface mt-1 group-hover:text-primary transition-colors">
            {name}
          </h2>
          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <span className="text-[22px] font-extrabold text-on-surface">
            {formatNaira(price)}
          </span>
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="bg-surface-container-high hover:bg-surface-container text-on-surface py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider transition-all"
            >
              {added ? "Added ✓" : "Quick Add"}
            </button>
            <Link
              href={`/product/${slug}`}
              className="bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
            >
              Buy Now
              <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
