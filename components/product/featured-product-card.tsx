"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, formatNaira } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export interface FeaturedProductCardProps {
  /** Optional real Supabase product UUID for instant checkout */
  productId?: string;
  /** Optional slug */
  slug?: string;
  /** Product name */
  name: string;
  /** Price in Naira */
  price: number;
  /** Primary image URL */
  imageUrl: string;
  /** Link to the product detail page */
  href: string;
  /** Optional image alt text */
  imageAlt?: string;
  /** Short category/collection tag shown under the name */
  tagline?: string;
  /** One-line description */
  description?: string;
  /** Optional neutral badge (e.g. "New Arrival") */
  badge?: string;
  /** Larger, highlighted "featured" card treatment */
  featured?: boolean;
  /** Distance in index from active centered card (0 = active, 1 = neighbor, >=2 = distant) */
  distance?: number;
  /** Optional click callback for non-featured flanking cards to bring them into center focus */
  onCardClick?: () => void;
}

export function FeaturedProductCard({
  productId,
  slug,
  name,
  price,
  imageUrl,
  href,
  imageAlt,
  tagline,
  description,
  badge,
  featured = false,
  distance = 0,
  onCardClick,
}: FeaturedProductCardProps) {
  const router = useRouter();
  const buyNow = useCartStore((state) => state.buyNow);

  const handleBuyNow = (e: React.MouseEvent) => {
    if (productId) {
      e.preventDefault();
      e.stopPropagation();
      buyNow({
        productId,
        slug: slug || "",
        name,
        price,
        quantity: 1,
        imageUrl,
        selectedColour: null,
        selectedSize: null,
        variationId: null,
      });
      router.push("/checkout");
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!featured && onCardClick) {
      e.preventDefault();
      onCardClick();
    }
  };

  // Resolve visual focal depth state based on distance from active center
  const isNeighbor = distance === 1;
  const isDistant = distance >= 2;

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "snap-center shrink-0 flex flex-col justify-between bg-white rounded-[28px] p-3 sm:p-3.5 border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu origin-center w-[255px] sm:w-[280px] motion-reduce:transition-none",
        featured
          ? "border-brand-warm-brown/90 shadow-2xl shadow-brand-dark-brown/20 ring-1 ring-brand-warm-brown/30 -translate-y-2 scale-[1.08] opacity-100 z-30 relative"
          : isNeighbor
          ? "border-brand-beige/50 shadow-xs translate-y-0 scale-[0.92] opacity-30 hover:opacity-40 z-10 relative cursor-pointer"
          : isDistant
          ? "border-brand-beige/30 shadow-none translate-y-0 scale-[0.88] opacity-10 z-0 relative cursor-pointer"
          : "border-brand-beige/60 shadow-xs translate-y-0 scale-[0.92] opacity-30 z-10 relative cursor-pointer"
      )}
      data-purpose="featured-product-card"
    >
      {/* Image frame */}
      <div className="relative w-full h-52 sm:h-56 overflow-hidden rounded-2xl bg-brand-ivory">
        <Image
          src={imageUrl}
          alt={imageAlt ?? name}
          fill
          className="object-cover object-center transition duration-300 hover:scale-105"
          sizes="(max-width: 640px) 255px, 280px"
        />

        {/* Top-left badge */}
        {badge && (
          <div
            className={cn(
              "absolute text-white font-bold tracking-wide uppercase rounded-full backdrop-blur-md top-2.5 left-2.5 text-[10px] px-2.5 py-1",
              featured ? "bg-brand-warm-brown shadow-xs" : "bg-black/40"
            )}
          >
            {badge}
          </div>
        )}

        {/* Top-right brand emblem */}
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-brand-warm-brown shadow-xs">
          <span className="font-display font-black text-[10px]">
            U
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-col justify-between flex-1 px-1",
          featured ? "pt-4 pb-1" : "pt-3.5 pb-1"
        )}
      >
        <div>
          {tagline && (
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-primary block mb-0.5">
              {tagline}
            </span>
          )}
          <h4 className="font-sans font-bold text-on-surface leading-snug line-clamp-1 text-sm sm:text-base">
            {name}
          </h4>
          {description && (
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-brand-beige/50 mt-3.5 pt-2.5">
          <span className="rounded-full bg-surface-container font-extrabold text-on-surface px-2.5 py-1 text-xs sm:text-sm">
            {formatNaira(price)}
          </span>
          <Link
            href={href}
            onClick={handleBuyNow}
            className="inline-flex items-center rounded-full bg-primary text-on-primary font-bold uppercase tracking-wider transition hover:bg-brand-warm-brown-dark px-3.5 py-1.5 text-xs gap-1 shadow-xs hover-lift cursor-pointer"
          >
            Buy Now
            <span className="text-[11px]">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
