"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export interface ShopProductCardProps {
  /** Real Supabase Product UUID */
  id: string;
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
  id,
  slug,
  name,
  price,
  imageUrl,
  categoryLabel,
  description,
  ages,
  badge,
}: ShopProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const buyNow = useCartStore((state) => state.buyNow);
  const [added, setAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const handleQuickAdd = () => {
    addItem({
      productId: id,
      slug,
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

  const handleBuyNow = () => {
    buyNow({
      productId: id,
      slug,
      name,
      price,
      quantity: 1,
      imageUrl,
      selectedColour: null,
      selectedSize: null,
      variationId: null,
    });
    router.push("/checkout");
  };

  return (
    <article
      className="group flex flex-col bg-surface-container-lowest rounded-2xl p-4 shadow-ambient hover:shadow-xl transition-all duration-300"
      data-purpose="shop-product-card"
    >
      {/* Image frame */}
      <Link
        href={`/product/${slug}`}
        className="block relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`View details for ${name}`}
      >
        {!imgFailed ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            onError={() => setImgFailed(true)}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-outline">
            <ImageOff className="w-8 h-8" strokeWidth={1.5} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">
              Image Unavailable
            </span>
          </div>
        )}

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
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between gap-2 text-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {categoryLabel}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-on-surface mt-1 transition-colors leading-snug">
            <Link
              href={`/product/${slug}`}
              className="hover:text-primary transition-colors focus:outline-none focus:underline"
            >
              {name}
            </Link>
          </h2>
          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <span className="text-xl sm:text-[22px] font-extrabold text-on-surface">
            {formatNaira(price)}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="min-h-[40px] bg-surface-container-high hover:bg-surface-container text-on-surface py-2 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center"
            >
              {added ? "Added ✓" : "Quick Add"}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="min-h-[40px] bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary py-2 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Buy Now
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
