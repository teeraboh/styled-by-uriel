"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowDown,
  ArrowRight,
  CheckCircle,
  BadgeCheck,
  MessageCircle,
  Truck,
  Layers,
  RefreshCw,
  CreditCard,
  Check,
  ShoppingBag,
} from "lucide-react";
import { cn, formatNaira } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { Category, Product } from "@/types";

interface CollectionClientProps {
  category: Category;
  categories: Category[];
  products: Product[];
}

export function CollectionClient({
  category,
  categories,
  products,
}: CollectionClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [addedId, setAddedId] = useState<string | null>(null);

  const minPrice =
    products.length > 0
      ? Math.min(...products.map((p) => p.price))
      : 25000;

  const heroImage =
    products[0]?.images?.[0]?.image_url ||
    "https://lh3.googleusercontent.com/aida/AEtjO1Xgzlvx5oI4TZhJrEZglLEzJltz-LpPJ6KKwatmoNQ5wPPTpwapFY9QrpQf6NVb152Yfx7o-4VcD1yVUWbXR4ljhHRIqg9S0tF198a5TMXadgn-AKKmx2mRAfKLVJ8RLZmJ61He5sGOUIV23vlOdglwXV1Edh10UX7LwEVjsXCNLuWqwOKn5odHMRLIOdTnU8kJDFA3vY7z4iKjah3-aag8BbafBIcniNnU5yQnLu9K1PyosXdV1EPkKy8";

  const heroLabel = products[0]?.name || `${category.name} Collection`;
  const heroPrice = products[0]?.price || minPrice;

  const handleQuickAdd = (product: Product) => {
    const mainImageUrl = product.images?.[0]?.image_url || "";
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: mainImageUrl,
      selectedColour: null,
      selectedSize: null,
      variationId: null,
    });
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <main className="bg-surface">
      {/* ── Breadcrumb & metadata ── */}
      <section className="w-full bg-surface-container-low/70 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-primary font-bold">{category.name}</span>
          </nav>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded text-[11px] font-bold tracking-wider text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              ABA ATELIER
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Made in Abia State</span>
          </div>
        </div>
      </section>

      {/* ── Editorial hero ── */}
      <section className="w-full relative overflow-hidden bg-surface py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full text-on-surface-variant text-[11px] font-bold tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
              Capsule Collection • Aba Atelier Drop • 2026 Edition
            </div>
            <h1 className="font-display text-3xl lg:text-[48px] lg:leading-[54px] text-on-surface tracking-tight font-semibold">
              {category.name}
            </h1>
            <p className="text-base text-on-surface-variant max-w-2xl">
              Tailored luxury streetwear crafted in Aba, Abia State from heavy
              brushed cotton fleece, varsity chenille embroidery, and relaxed
              cuts designed for active young dreamers across Nigeria.
            </p>

            {/* Metrics bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-1">
              {[
                { label: "Edition", value: `${products.length} Pieces` },
                { label: "Age Range", value: "2Y – 12Y" },
                {
                  label: "Pricing",
                  value: `From ${formatNaira(minPrice)}`,
                  accent: true,
                },
                { label: "Origin", value: "Aba, Nigeria" },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="bg-surface-container-low p-3 rounded-lg flex flex-col"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {label}
                  </span>
                  <span
                    className={cn(
                      "text-lg font-bold text-on-surface",
                      accent && "text-primary"
                    )}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="#collection-grid"
                className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-5 py-2.5 rounded text-[13px] font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                Explore Capsule Pieces
                <ArrowDown className="w-4 h-4" strokeWidth={2} />
              </a>
              <a
                href="https://wa.me/2347039315917"
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface hover:bg-surface-variant px-4 py-2.5 rounded text-[13px] font-semibold uppercase tracking-wider transition-colors"
              >
                <MessageCircle
                  className="w-4 h-4 text-primary"
                  strokeWidth={1.75}
                />
                Pre-order via Concierge
              </a>
            </div>
          </div>

          {/* Hero image */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-surface-container rounded-2xl overflow-hidden shadow-xl aspect-[4/5] p-4 group">
              <Image
                src={heroImage}
                alt={heroLabel}
                fill
                className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
              <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <BadgeCheck
                  className="w-3.5 h-3.5 text-secondary"
                  strokeWidth={2}
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface">
                  Atelier Verified Cut
                </span>
              </div>
              <div className="absolute bottom-4 inset-x-4 bg-surface/95 backdrop-blur-md p-3 rounded-xl shadow-lg flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Featured Editorial Look
                  </span>
                  <span className="text-sm font-bold text-on-surface line-clamp-1">
                    {heroLabel}
                  </span>
                </div>
                <span className="text-lg font-extrabold text-primary">
                  {formatNaira(heroPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product grid ── */}
      <section
        className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface"
        id="collection-grid"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Drop Catalog
              </span>
              <h2 className="font-display text-3xl text-on-surface tracking-tight font-semibold">
                The {products.length} Foundational Silhouettes
              </h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-md">
              Crafted in small-batch editions with complimentary personalized
              sizing consultation on WhatsApp.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/20">
              <ShoppingBag className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-60" />
              <p className="text-on-surface text-base font-semibold">
                No pieces in this category yet.
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                New drops are being tailored at the Aba atelier.
              </p>
              <Link
                href="/shop"
                className="mt-5 inline-flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const mainImage =
                  product.images && product.images.length > 0
                    ? product.images[0].image_url
                    : "";

                return (
                  <article
                    key={product.id}
                    className="flex flex-col bg-surface-container-low rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group border border-outline-variant/10"
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      className="relative aspect-square w-full bg-surface-container overflow-hidden block"
                    >
                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">
                          No Image
                        </div>
                      )}
                    </Link>

                    <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                          <span>{category.name}</span>
                          {!product.availability && (
                            <span className="text-destructive font-semibold">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="text-lg font-bold text-on-surface uppercase group-hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-3 flex items-center justify-between gap-3 border-t border-outline-variant/10">
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                            Nigeria Naira
                          </span>
                          <span className="text-[22px] font-extrabold text-on-surface">
                            {formatNaira(product.price)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(product)}
                          disabled={!product.availability}
                          className={cn(
                            "px-4 py-2 rounded text-[13px] font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1 shadow-sm",
                            product.availability
                              ? "bg-secondary-container hover:bg-secondary text-secondary hover:text-on-secondary"
                              : "bg-surface-container-highest text-on-surface-variant opacity-50 cursor-not-allowed"
                          )}
                        >
                          {addedId === product.id ? "Added ✓" : "Quick Add"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Storytelling spotlight ── */}
      <section className="w-full bg-surface-container py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
              Tactile Luxury &amp; Integrity
            </span>
            <h2 className="font-display text-3xl text-on-surface tracking-tight font-semibold">
              Crafted at Enyimba Market, Aba
            </h2>
            <p className="text-sm text-on-surface-variant">
              Under the artistic direction of Natasha Ezinne Amuruonyenaego, our
              pieces undergo bespoke pattern-cutting and artisan assembly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                title: "Heavy Brushed Fleece",
                text: "Soft, skin-friendly natural fibers selected for tropical breathability and lasting structure.",
                tag: "Pure Natural Weave",
              },
              {
                icon: RefreshCw,
                title: "Tactile Chenille Embroidery",
                text: "Varsity numerals and the signature crest precision-stitched with plush 3D chenille loop thread.",
                tag: "Hand-finished In Aba",
              },
              {
                icon: BadgeCheck,
                title: "Reinforced Active Seams",
                text: "Double-needle flatlock seams and bar-tacked stress points across high-wear areas.",
                tag: "Playproof Resilience",
              },
            ].map(({ icon: Icon, title, text, tag }) => (
              <div
                key={title}
                className="bg-surface p-6 rounded-2xl shadow-sm flex flex-col gap-3 hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-on-surface">{title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {text}
                </p>
                <div className="mt-auto pt-2 text-xs text-primary font-bold flex items-center gap-1">
                  {tag}
                  <CheckCircle className="w-4 h-4" strokeWidth={2} />
                </div>
              </div>
            ))}
          </div>

          {/* Founder card */}
          <div className="w-full bg-surface-container-highest p-6 lg:p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-primary flex items-center justify-center shrink-0">
                <span className="font-display text-2xl text-on-primary font-bold">
                  N
                </span>
              </div>
              <div className="flex flex-col">
                <p className="text-base italic text-on-surface leading-snug">
                  Natasha Ezinne Amuruonyenaego — Founder &amp; Creative Director
                </p>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary mt-1">
                  Enyimba Market, Aba, Abia State
                </span>
              </div>
            </div>
            <a
              className="shrink-0 inline-flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-5 py-2.5 rounded text-[13px] font-semibold uppercase tracking-wider transition-colors shadow-sm"
              href="https://wa.me/2347039315917"
              rel="noopener noreferrer"
              target="_blank"
            >
              Speak With Natasha
              <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Category switcher ── */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Explore The Universe
            </span>
            <h2 className="font-display text-3xl text-on-surface tracking-tight font-semibold">
              Curated Atelier Categories
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((item, index) => {
              const isActive =
                item.slug.toLowerCase() === category.slug.toLowerCase();
              const inner = (
                <>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-[11px] font-bold uppercase tracking-wider",
                        isActive ? "text-primary" : "text-on-surface-variant"
                      )}
                    >
                      Category 0{index + 1}
                    </span>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider">
                        Viewing
                      </span>
                    ) : (
                      <ArrowRight
                        className="w-4 h-4 text-on-surface-variant"
                        strokeWidth={2}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-on-surface">
                      {item.name}
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Explore our handcrafted {item.name.toLowerCase()} range.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[13px] font-semibold">
                    <span className="text-primary font-bold">Explore Drop</span>
                    {isActive && (
                      <Check className="w-4 h-4 text-primary" strokeWidth={2} />
                    )}
                  </div>
                </>
              );

              return isActive ? (
                <div
                  key={item.slug}
                  className="relative bg-surface-container-high rounded-xl p-4 flex flex-col justify-between gap-4 ring-2 ring-primary/40 shadow-sm"
                >
                  {inner}
                </div>
              ) : (
                <Link
                  key={item.slug}
                  href={`/shop/${item.slug}`}
                  className="bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-xl p-4 flex flex-col justify-between gap-4 group"
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Reassurance strip ── */}
      <section className="w-full bg-surface-container-low py-6 px-4 sm:px-6 lg:px-8 border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Truck,
              title: "Nationwide Dispatch",
              text: "Direct dispatch from Aba",
            },
            {
              icon: CheckCircle,
              title: "Skin-Safe Textiles",
              text: "Soft natural cotton fleece",
            },
            {
              icon: Sparkles,
              title: "Exact Sizing",
              text: "Direct size check on WhatsApp",
            },
            {
              icon: CreditCard,
              title: "Seamless Payment",
              text: "Card checkout via Flutterwave",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 p-2">
              <Icon
                className="w-7 h-7 text-primary shrink-0"
                strokeWidth={1.75}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-on-surface">
                  {title}
                </span>
                <span className="text-xs text-on-surface-variant">{text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
