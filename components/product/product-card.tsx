import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";

export interface ProductCardProps {
  /** Product slug for the detail page link */
  slug: string;
  /** Product name */
  name: string;
  /** Price in Naira (number) */
  price: number;
  /** Primary image URL */
  imageUrl: string;
  /** Image alt text */
  imageAlt?: string;
  /** Optional badge (e.g. "New", "Sold Out") */
  badge?: string;
  /** Whether the product is out of stock */
  isOutOfStock?: boolean;
  /** Category name for subtitle */
  category?: string;
}

export function ProductCard({
  slug,
  name,
  price,
  imageUrl,
  imageAlt,
  badge,
  isOutOfStock = false,
  category,
}: ProductCardProps) {
  return (
    <div className="group hover-lift" data-purpose="product-card">
      <Link href={`/product/${slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-brand-ivory mb-4">
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3">
              <Badge
                variant={isOutOfStock ? "outline" : "default"}
              >
                {badge}
              </Badge>
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-brand-cream/50 flex items-center justify-center">
              <span className="text-sm font-bold uppercase tracking-wider text-brand-dark-brown bg-white/80 px-4 py-2 rounded-sm">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="text-center space-y-1.5">
          {category && (
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
              {category}
            </p>
          )}
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark-brown line-clamp-1">
            {name}
          </h3>
          <p className="text-lg font-extrabold text-brand-dark-brown tracking-tight">
            {formatNaira(price)}
          </p>
        </div>
      </Link>

      {/* Shop Now Button */}
      <div className="mt-3 text-center">
        <Button
          variant="secondary"
          size="sm"
          className="w-full max-w-[180px]"
          disabled={isOutOfStock}
          asChild={!isOutOfStock}
        >
          {isOutOfStock ? (
            <span>Sold Out</span>
          ) : (
            <Link href={`/product/${slug}`}>Shop Now</Link>
          )}
        </Button>
      </div>
    </div>
  );
}
