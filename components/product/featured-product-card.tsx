"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, formatNaira } from "@/lib/utils";

export interface FeaturedProductCardProps {
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
}

export function FeaturedProductCard({
  name,
  price,
  imageUrl,
  href,
  imageAlt,
  tagline,
  description,
  badge,
  featured = false,
}: FeaturedProductCardProps) {
  return (
    <div
      className={cn(
        "snap-center shrink-0 flex flex-col justify-between bg-white border transition-all duration-300 hover:-translate-y-1",
        featured
          ? "w-[270px] sm:w-[295px] rounded-[32px] border-2 border-brand-warm-brown/60 p-3.5 sm:p-4 shadow-2xl -translate-y-2"
          : "w-[240px] sm:w-[265px] rounded-[28px] border-brand-beige/60 p-3 sm:p-3.5 shadow-sm hover:shadow-xl"
      )}
      data-purpose="featured-product-card"
    >
      {/* Image frame */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-brand-ivory",
          featured ? "h-56 sm:h-60" : "h-52 sm:h-56"
        )}
      >
        <Image
          src={imageUrl}
          alt={imageAlt ?? name}
          fill
          className="object-cover object-center transition duration-300 hover:scale-105"
          sizes="(max-width: 640px) 240px, 265px"
        />

        {/* Top-left badge */}
        {badge && (
          <div
            className={cn(
              "absolute text-white font-bold tracking-wide uppercase rounded-full backdrop-blur-md",
              featured
                ? "top-3 left-3 bg-brand-warm-brown px-3 py-1 text-[10px] font-extrabold tracking-wider shadow-md"
                : "top-2.5 left-2.5 bg-black/40 px-2.5 py-1 text-[10px]"
            )}
          >
            {badge}
          </div>
        )}

        {/* Top-right brand emblem */}
        <div
          className={cn(
            "absolute rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-brand-warm-brown",
            featured
              ? "top-3 right-3 w-8 h-8 shadow-md"
              : "top-2.5 right-2.5 w-7 h-7 shadow-xs"
          )}
        >
          <span
            className={cn(
              "font-display font-black",
              featured ? "text-xs" : "text-[10px]"
            )}
          >
            U
          </span>
        </div>

        {/* Bottom-center pagination dots */}
        <div
          className={cn(
            "absolute inset-x-0 flex items-center justify-center gap-1.5",
            featured ? "bottom-3" : "bottom-2.5"
          )}
        >
          <span
            className={cn(
              "rounded-full bg-white shadow-xs",
              featured ? "w-2 h-2" : "w-1.5 h-1.5"
            )}
          />
          <span
            className={cn(
              "rounded-full",
              featured ? "w-1.5 h-1.5 bg-white/60" : "w-1.5 h-1.5 bg-white/50"
            )}
          />
          <span
            className={cn(
              "rounded-full",
              featured ? "w-1.5 h-1.5 bg-white/60" : "w-1.5 h-1.5 bg-white/50"
            )}
          />
          {featured && <span className="w-1.5 h-1.5 rounded-full bg-white/60" />}
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
          <h4
            className={cn(
              "font-display font-bold text-brand-dark-brown",
              featured ? "text-base" : "text-sm"
            )}
          >
            {name}
          </h4>
          {tagline && (
            <p
              className={cn(
                "text-brand-warm-brown mt-0.5",
                featured ? "text-xs font-semibold" : "text-[11px] font-medium"
              )}
            >
              {tagline}
            </p>
          )}
          {description && (
            <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-1">
              {description}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex items-center justify-between border-t",
            featured ? "mt-4 pt-3 border-brand-beige/50" : "mt-3 pt-2.5 border-brand-beige/40"
          )}
        >
          <span
            className={cn(
              "rounded-full bg-brand-cream font-black text-brand-dark-brown",
              featured ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs"
            )}
          >
            {formatNaira(price)}
          </span>
          <Link
            href={href}
            className={cn(
              "inline-flex items-center rounded-full bg-brand-warm-brown text-white font-bold transition hover:bg-brand-warm-brown-dark",
              featured
                ? "px-4 py-2 text-xs uppercase tracking-wider gap-1.5 shadow-md hover-lift"
                : "px-3 py-1.5 text-xs gap-1 shadow-xs"
            )}
          >
            Buy Now
            <span className={featured ? "text-xs" : "text-[11px]"}>↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
