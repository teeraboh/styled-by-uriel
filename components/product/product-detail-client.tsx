"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ZoomIn,
  Minus,
  Plus,
  ShoppingBag,
  ArrowUpRight,
  MessageCircle,
  Truck,
  RefreshCw,
  BadgeCheck,
  Ruler,
  X,
  Shirt,
  Palette,
  MoveHorizontal,
  Package,
  Leaf,
  Droplets,
  Store,
  ArrowRight,
} from "lucide-react";
import { cn, formatNaira } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida/AEtjO1Xgzlvx5oI4TZhJrEZglLEzJltz-LpPJ6KKwatmoNQ5wPPTpwapFY9QrpQf6NVb152Yfx7o-4VcD1yVUWbXR4ljhHRIqg9S0tF198a5TMXadgn-AKKmx2mRAfKLVJ8RLZmJ61He5sGOUIV23vlOdglwXV1Edh10UX7LwEVjsXCNLuWqwOKn5odHMRLIOdTnU8kJDFA3vY7z4iKjah3-aag8BbafBIcniNnU5yQnLu9K1PyosXdV1EPkKy8";

const COLOURS = [
  { name: "Sand Dune Beige", hex: "#E3CBB7" },
  { name: "Charcoal Slate", hex: "#403E43" },
  { name: "Warm Cream Ivory", hex: "#F5EFE6" },
  { name: "Midnight Navy", hex: "#1F2738" },
];

const SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"];

const FEATURES = [
  { icon: Shirt, title: "Oversized Silhouette", text: "Easy layering and unrestricted movement." },
  { icon: Palette, title: "Custom Chenille Patches", text: "Tactile varsity embroidery details." },
  { icon: MoveHorizontal, title: "Elasticated Waistband", text: "Soft inner lining with functional drawcord." },
  { icon: Package, title: "Cargo Pockets", text: "Deep dual side utility pockets." },
];

type TabId = "details" | "materials" | "sizing" | "shipping";

const TABS: { id: TabId; label: string }[] = [
  { id: "details", label: "Details & Features" },
  { id: "materials", label: "Materials & Care" },
  { id: "sizing", label: "Size & Fit Guide" },
  { id: "shipping", label: "Shipping & Aba Pickups" },
];

interface ProductDetailClientProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const buyNow = useCartStore((state) => state.buyNow);

  // Gallery images sorted by sort_order (0 is primary main image)
  const gallery = useMemo(() => {
    if (product.images && product.images.length > 0) {
      const sorted = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
      return sorted.map((img, idx) => ({
        src: img.image_url,
        alt: `${product.name} - Angle ${idx + 1}`,
      }));
    }
    return [{ src: FALLBACK_IMAGE, alt: product.name }];
  }, [product]);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColour, setSelectedColour] = useState(COLOURS[0].name);
  const [selectedSize, setSelectedSize] = useState("4-5Y");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [added, setAdded] = useState(false);

  // Lock body scroll and handle Escape when any modal is open
  useEffect(() => {
    if (!showZoomModal && !showSizeModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowZoomModal(false);
        setShowSizeModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showZoomModal, showSizeModal]);

  const categoryLabel = product.category?.name || "Boutique Garment";
  const categorySlug = product.category?.slug || "all";
  const description =
    product.description || `${product.name} • Handcrafted in Enyimba Atelier, Aba.`;

  const handleAddToCart = () => {
    addItem({
      productId: product.id, // Real Supabase product UUID
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: gallery[0]?.src || FALLBACK_IMAGE,
      selectedColour,
      selectedSize,
      variationId: null,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    buyNow({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: gallery[0]?.src || FALLBACK_IMAGE,
      selectedColour,
      selectedSize,
      variationId: null,
    });
    router.push("/checkout");
  };

  const handleQuickAddRelated = (rel: Product) => {
    const relImage = rel.images?.[0]?.image_url || FALLBACK_IMAGE;
    addItem({
      productId: rel.id,
      slug: rel.slug,
      name: rel.name,
      price: rel.price,
      quantity: 1,
      imageUrl: relImage,
      selectedColour: null,
      selectedSize: null,
      variationId: null,
    });
  };

  const currentImage = gallery[activeImage] || gallery[0];

  return (
    <main className="bg-surface">
      {/* ── Breadcrumb ── */}
      <div className="w-full bg-surface-container-low/60 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] text-on-surface-variant overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-nowrap">
          <Link href="/" className="hover:text-primary transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/shop" className="hidden sm:inline-flex hover:text-primary transition-colors shrink-0">
            Boys Streetwear
          </Link>
          <ChevronRight className="hidden sm:inline-block w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/shop`}
            className="hover:text-primary transition-colors shrink-0"
          >
            {categoryLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-on-surface font-semibold shrink-0 sm:max-w-none">
            {product.name}
          </span>
        </div>
      </div>

      {/* ── Main PDP ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {gallery.length > 1 && (
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 flex-shrink-0">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      "relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-surface-container transition-all shadow-sm cursor-pointer",
                      activeImage === index
                        ? "ring-2 ring-primary"
                        : "hover:ring-2 hover:ring-primary/60"
                    )}
                    aria-label={`View angle ${index + 1}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover object-center"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex-1 rounded-2xl overflow-hidden bg-surface-container-low shadow-sm aspect-[4/5] sm:aspect-auto sm:min-h-[580px]">
              <Image
                src={currentImage.src}
                alt={currentImage.alt || product.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                <span className="bg-surface-container-high/90 backdrop-blur-md text-primary text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  Aba Atelier • Live Drop
                </span>
              </div>
              <button
                aria-label="Zoom image details"
                type="button"
                onClick={() => setShowZoomModal(true)}
                className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-surface/85 backdrop-blur-md text-on-surface shadow-md flex items-center justify-center hover:bg-surface hover:text-primary transition-all cursor-pointer"
              >
                <ZoomIn className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Info panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                {categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                <BadgeCheck className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                Aba Handcrafted
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-[36px] text-on-surface leading-tight font-semibold tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 bg-surface-container-low p-3 rounded-xl">
              <span className="text-[22px] font-extrabold text-on-surface">
                {formatNaira(product.price)}
              </span>
              {product.stock_quantity <= 4 && product.stock_quantity > 0 && (
                <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
                  Only {product.stock_quantity} left in stock
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              {description}
            </p>

            {/* Colour swatches */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface font-semibold">
                  Color:{" "}
                  <span className="text-primary font-bold">{selectedColour}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {COLOURS.map((colour) => (
                  <button
                    key={colour.name}
                    type="button"
                    aria-label={colour.name}
                    title={colour.name}
                    onClick={() => setSelectedColour(colour.name)}
                    className={cn(
                      "relative w-9 h-9 rounded-full shadow-sm transition-all cursor-pointer",
                      selectedColour === colour.name
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-surface"
                        : "ring-1 ring-outline-variant/50 hover:ring-primary"
                    )}
                    style={{ backgroundColor: colour.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface font-semibold">
                  Age Size:{" "}
                  <span className="text-primary font-bold">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeModal(true)}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  <Ruler className="w-4 h-4" strokeWidth={1.75} />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "py-2 px-0.5 sm:px-1 text-center rounded-lg text-[11px] sm:text-[13px] font-semibold uppercase min-h-[38px] sm:min-h-[40px] transition-all cursor-pointer",
                      selectedSize === size
                        ? "bg-primary-container text-on-primary-container font-bold shadow-sm"
                        : "bg-surface-container-high text-on-surface hover:bg-primary/10"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                <Ruler className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={1.75} />
                True to size with generous room for growth.
              </p>
            </div>

            {/* Quantity + action buttons */}
            <div className="pt-1 flex flex-col gap-2.5 sm:gap-3">
              {/* Row 1 on mobile: Stepper + Add To Cart; Single horizontal row on desktop (sm+) */}
              <div className="flex items-stretch sm:items-center gap-2.5 sm:gap-3">
                <div className="flex items-center rounded-xl bg-surface-container-high p-1 shrink-0">
                  <button
                    aria-label="Decrease quantity"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <span className="w-8 sm:w-10 text-center text-base font-bold text-on-surface">
                    {quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 min-h-[44px] sm:min-h-[48px] bg-surface-container-high hover:bg-surface-container text-on-surface py-3 px-3 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/40"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" strokeWidth={2} />
                  <span>{added ? "Added ✓" : "Add To Cart"}</span>
                </button>
                {/* Desktop Buy Now (sm+) */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="hidden sm:flex flex-1 min-h-[48px] bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary py-3 px-3 rounded-xl text-[13px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Buy Now • {formatNaira(product.price * quantity)}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" strokeWidth={2} />
                </button>
              </div>

              {/* Row 2 on mobile: Full-width Buy Now button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="sm:hidden w-full min-h-[46px] bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary py-3 px-4 rounded-xl text-[13px] font-bold uppercase tracking-wider shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Buy Now • {formatNaira(product.price * quantity)}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" strokeWidth={2} />
              </button>

              <a
                className="w-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#14532D] py-2.5 px-4 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-colors text-center"
                href={`https://wa.me/2347039315917?text=Hello%20Styled%20by%20Uriel,%20I%20want%20to%20order%20the%20${encodeURIComponent(product.name)}%20(Size:%20${selectedSize},%20${selectedColour})`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" strokeWidth={2} />
                <span>Instant WhatsApp Order &amp; Custom Fit Check</span>
              </a>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-1 bg-surface-container-low/70 p-4 rounded-xl">
              <div className="flex items-start gap-2">
                <Truck className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.75} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">Nationwide Delivery</span>
                  <span className="text-[11px] text-on-surface-variant">
                    Direct dispatch from Aba
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.75} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">Hassle-Free Exchange</span>
                  <span className="text-[11px] text-on-surface-variant">
                    Sizing support on WhatsApp
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.75} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">Artisanal Quality</span>
                  <span className="text-[11px] text-on-surface-variant">
                    Reinforced double seams
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Specs & details tabs ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="w-full overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex items-center gap-2 bg-surface-container-low/40 p-1.5 rounded-xl min-w-max pr-3 sm:pr-1.5">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer",
                    activeTab === tab.id
                      ? "bg-primary-container text-on-primary-container shadow-sm"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 flex flex-col gap-4">
              {activeTab === "details" && (
                <>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-on-surface">
                      Designed in Aba for Nigeria&apos;s Trendiest Littles
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Crafted from soft, breathable heavyweight cotton fleece,
                      this piece pairs runway-worthy design with all-day
                      energetic playability.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FEATURES.map(({ icon: Icon, title, text }) => (
                      <div
                        key={title}
                        className="flex items-start gap-2 p-3 bg-surface-container-low rounded-xl"
                      >
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.75} />
                        <div>
                          <h4 className="text-[13px] font-bold text-on-surface">{title}</h4>
                          <p className="text-xs text-on-surface-variant">{text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === "materials" && (
                <>
                  <h3 className="text-lg font-bold text-on-surface">
                    Textile Integrity &amp; Longevity
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Created with gentle, skin-safe dyed organic fleece that
                    breathes during warm afternoons and retains warmth indoors.
                  </p>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-primary" strokeWidth={1.75} />
                      Combed natural cotton fleece
                    </li>
                    <li className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-primary" strokeWidth={1.75} />
                      Pre-shrunk textile engineering
                    </li>
                    <li className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-primary" strokeWidth={1.75} />
                      Machine wash cold with mild detergent
                    </li>
                    <li className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-primary" strokeWidth={1.75} />
                      Line dry in the shade
                    </li>
                  </ul>
                </>
              )}

              {activeTab === "sizing" && (
                <>
                  <h3 className="text-lg font-bold text-on-surface">
                    Kids Sizing Guidelines
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Our clothes use a relaxed contemporary fit. If your child is
                    between sizes, we recommend sizing up.
                  </p>
                  <div className="overflow-x-auto bg-surface-container-low rounded-xl p-3">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-on-surface font-bold">
                          <th className="pb-2">Size</th>
                          <th className="pb-2">Age</th>
                        </tr>
                      </thead>
                      <tbody className="text-on-surface-variant">
                        <tr><td className="py-1">2-3Y</td><td>Toddler</td></tr>
                        <tr><td className="py-1">4-5Y</td><td>Little Kid</td></tr>
                        <tr><td className="py-1">6-7Y</td><td>Mid Kid</td></tr>
                        <tr><td className="py-1">8-9Y</td><td>Big Kid</td></tr>
                        <tr><td className="py-1">10-12Y</td><td>Pre-Teen</td></tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === "shipping" && (
                <>
                  <h3 className="text-lg font-bold text-on-surface">
                    Dispatch &amp; Nationwide Logistics
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Orders ship directly from our production hub at Enyimba
                    Market, Aba via interstate courier partners.
                  </p>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" strokeWidth={1.75} />
                      Nationwide delivery across Nigeria
                    </li>
                    <li className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-primary" strokeWidth={1.75} />
                      Local pickup available in Aba
                    </li>
                    <li className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-primary" strokeWidth={1.75} />
                      Delivery details confirmed on WhatsApp
                    </li>
                  </ul>
                </>
              )}
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-[16/10] sm:aspect-[16/9] bg-surface-container">
                <Image
                  src={gallery[1]?.src || gallery[0]?.src}
                  alt={`${product.name} craftsmanship angle`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-brown/80 via-brand-dark-brown/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-beige">
                    Crafted in Aba, Abia State
                  </span>
                  <p className="text-lg font-bold text-white mt-1">
                    Authentic Atelier Tailoring
                  </p>
                  <p className="text-xs text-brand-ivory/90 max-w-md mt-1">
                    Soft against sensitive young skin, tough enough for muddy
                    weekend adventures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Complete the look / Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Curated Ensemble
                </span>
                <h2 className="font-display text-3xl text-on-surface font-semibold">
                  Complete The Look
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-[13px] font-bold uppercase tracking-wider text-primary hover:text-on-surface transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => {
                const relImage = rel.images?.[0]?.image_url || FALLBACK_IMAGE;
                return (
                  <div
                    key={rel.id}
                    className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Link
                      href={`/product/${rel.slug}`}
                      className="relative aspect-square bg-surface-container-low overflow-hidden"
                    >
                      <Image
                        src={relImage}
                        alt={rel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </Link>
                    <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {rel.category?.name || "Boutique Garment"}
                        </span>
                        <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                          {rel.name}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-extrabold text-on-surface">
                          {formatNaira(rel.price)}
                        </span>
                        <button
                          type="button"
                          aria-label={`Add ${rel.name} to cart`}
                          onClick={() => handleQuickAddRelated(rel)}
                          className="w-9 h-9 rounded-lg bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Size guide modal ── */}
      {showSizeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setShowSizeModal(false)}
        >
          <div
            className="bg-surface rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-4 sm:p-6 shadow-xl flex flex-col gap-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.75} />
                <h3 className="text-base sm:text-lg font-bold text-on-surface">
                  Nigerian Kids Sizing Chart
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
                aria-label="Close size guide"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Children in Nigeria grow fast and need freedom of movement for
              active play. If your child is between sizes, choose the larger
              size.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-surface-container text-on-surface font-bold">
                    <th className="p-2 rounded-l-lg">Size</th>
                    <th className="p-2 rounded-r-lg">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-on-surface-variant">
                  <tr><td className="p-2 font-bold text-on-surface">2-3Y</td><td className="p-2">Toddler</td></tr>
                  <tr className="bg-primary-container/10 font-medium text-on-surface">
                    <td className="p-2 font-bold">4-5Y (Recommended)</td>
                    <td className="p-2">Little Kid</td>
                  </tr>
                  <tr><td className="p-2 font-bold text-on-surface">6-7Y</td><td className="p-2">Mid Kid</td></tr>
                  <tr><td className="p-2 font-bold text-on-surface">8-9Y</td><td className="p-2">Big Kid</td></tr>
                  <tr><td className="p-2 font-bold text-on-surface">10-12Y</td><td className="p-2">Pre-Teen</td></tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col-reverse xs:flex-row justify-between items-stretch xs:items-center gap-3 pt-2">
              <a
                className="text-primary text-[13px] font-semibold flex items-center justify-center xs:justify-start gap-1 hover:underline"
                href="https://wa.me/2347039315917?text=Hi%20Natasha,%20I%20need%20help%20choosing%20the%20right%20size%20for%20my%20child"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                <span>Ask Natasha on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="bg-primary-container text-on-primary-container px-4 py-2.5 rounded-lg text-[13px] font-bold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Image zoom lightbox modal ── */}
      {showZoomModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setShowZoomModal(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90dvh] bg-surface rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-outline-variant/30 bg-surface">
              <span className="text-xs sm:text-sm font-bold text-on-surface truncate pr-2">
                {currentImage.alt}
              </span>
              <button
                type="button"
                onClick={() => setShowZoomModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer shrink-0"
                aria-label="Close image zoom"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] bg-black">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
