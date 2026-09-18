"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ZoomIn,
  Minus,
  Plus,
  ShoppingBag,
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

// ── Placeholder product data — replaced by Supabase queries (PRD §15). ──
const PRODUCT = {
  name: "Signature Up & Down Tracksuit Set",
  price: 25000,
  categoryLabel: "Boys Runway & Playtime Ready",
  description:
    "Tailored luxury kids streetwear set crafted from premium heavyweight brushed cotton fleece, with custom chenille varsity patches and matching cargo bottoms built for active play and runway swagger.",
};

const GALLERY_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida/AEtjO1Uh3gEyTnHu4YHjPhAZOjtFQv-cgN9fL8DMCOhJDN_aNHeClcul2kFGd9s7ATA0MhmbXLoUVZ51j0veaF64vYraFsN5qsrPFOVT55wPliS4CTvj97lSyV2nRXBoL2Spz8khlHwqtbGkV_VwX_868cgObp2ANJ5rN3aZRgTKCv-K6febeJPkTIt8LFo28mEyrWAqadVIzuG1jXfGyIjlE6UfqsWcOM8ujako-tZpBjc50Ot-rcCgxlDAJls",
    alt: "Model wearing full tracksuit",
  },
  {
    src: "https://lh3.googleusercontent.com/aida/AEtjO1Xgzlvx5oI4TZhJrEZglLEzJltz-LpPJ6KKwatmoNQ5wPPTpwapFY9QrpQf6NVb152Yfx7o-4VcD1yVUWbXR4ljhHRIqg9S0tF198a5TMXadgn-AKKmx2mRAfKLVJ8RLZmJ61He5sGOUIV23vlOdglwXV1Edh10UX7LwEVjsXCNLuWqwOKn5odHMRLIOdTnU8kJDFA3vY7z4iKjah3-aag8BbafBIcniNnU5yQnLu9K1PyosXdV1EPkKy8",
    alt: "Jacket flat-lay",
  },
  {
    src: "https://lh3.googleusercontent.com/aida/AEtjO1X14Ge7JzgTfg_YnNkpFzA4834yb99ZXiZ9TwB8TztYn6KecTnsfPoYJxz3CUJhXW_UmJ7vGG3K-rh_frcLUFty_JtXWUZBzrgmBwLzqvxU9A94Zd_X2cpji1SpuHUb6wA4z5ZEyfelbHZYk3KxrzfKG15CM5eS-YR_p29p9_iTTGwmbRGYCqJvJb-vIcXLmeKfzDYmPkC15JFuB8U744GArFo3VkzOm4uuZIXU379rnFqR7VnkR6GAMy0",
    alt: "Matching cargo bottoms",
  },
  {
    src: "https://lh3.googleusercontent.com/aida/AEtjO1Xgzlvx5oI4TZhJrEZglLEzJltz-LpPJ6KKwatmoNQ5wPPTpwapFY9QrpQf6NVb152Yfx7o-4VcD1yVUWbXR4ljhHRIqg9S0tF198a5TMXadgn-AKKmx2mRAfKLVJ8RLZmJ61He5sGOUIV23vlOdglwXV1Edh10UX7LwEVjsXCNLuWqwOKn5odHMRLIOdTnU8kJDFA3vY7z4iKjah3-aag8BbafBIcniNnU5yQnLu9K1PyosXdV1EPkKy8",
    alt: "Chenille varsity embroidery detail",
    detail: true,
  },
];

const COLOURS = [
  { name: "Sand Dune Beige", hex: "#E3CBB7" },
  { name: "Charcoal Slate", hex: "#403E43" },
  { name: "Warm Cream Ivory", hex: "#F5EFE6" },
  { name: "Midnight Navy", hex: "#1F2738" },
];

const SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"];

const RELATED_PRODUCTS = [
  {
    slug: "california-ringer-tee",
    name: "California Vintage Ringer Tee",
    price: 15000,
    category: "Tops & Tees",
    imageUrl:
      "https://lh3.googleusercontent.com/aida/AEtjO1UNGbh2Vydr4Elt1NIZop3F6TtBSVg95Qdi-m6yvH2DNFDJD_aP4L4dseK5CYqQsUzQiNJ7Z_wLZQYItoT9UUANh_mkZKW2aaQUwTOw2NKemf-Ncex5grs1N29ABimQ-s2Z1ChDTINMI7ZrxLdD0bkQ0AIkKA1zyEvsQQF0taWNPNrlTN7Cim9OzjQG2ByaNab_fipnsGXcblMuNcwVst2sZwgY23guuBFWMI0dGTugSE_F44ayA9V7EVs",
  },
  {
    slug: "denim-cargo-utility-jeans",
    name: "Denim Cargo Utility Jeans",
    price: 17000,
    category: "Denim",
    imageUrl:
      "https://lh3.googleusercontent.com/aida/AEtjO1VZFGAF20LCOV1QXdhtNxhydXUSDcVQbN3g_RGl_JLEtVj2F-7RbNQ2aJgOPQtKDi87ii4J1r4VFM9q31P20XeLSrAIxrfTtvrJV6uks_Ck36Ah4RC39jBV8zL2OdURjaMM11AE26HyeSZM1qJBkMpFnjsLQ_9grVzifAyt6-BwjQOz7IP7SlWRV_a_B--rmzv3J0O62UG0wkHdYd6xxKuoVDQFeisgKy6yiGtcaZpq4QbDeLUqMI8miL0",
  },
  {
    slug: "beige-cargo-shorts",
    name: "Beige Utility Cargo Shorts",
    price: 14000,
    category: "Bottoms",
    imageUrl:
      "https://lh3.googleusercontent.com/aida/AEtjO1X14Ge7JzgTfg_YnNkpFzA4834yb99ZXiZ9TwB8TztYn6KecTnsfPoYJxz3CUJhXW_UmJ7vGG3K-rh_frcLUFty_JtXWUZBzrgmBwLzqvxU9A94Zd_X2cpji1SpuHUb6wA4z5ZEyfelbHZYk3KxrzfKG15CM5eS-YR_p29p9_iTTGwmbRGYCqJvJb-vIcXLmeKfzDYmPkC15JFuB8U744GArFo3VkzOm4uuZIXU379rnFqR7VnkR6GAMy0",
  },
  {
    slug: "aura-pouch-beanie-ribbed-set",
    name: "Aura Pouch & Beanie Set",
    price: 9500,
    category: "Accessories",
    imageUrl:
      "https://lh3.googleusercontent.com/aida/AEtjO1X14Ge7JzgTfg_YnNkpFzA4834yb99ZXiZ9TwB8TztYn6KecTnsfPoYJxz3CUJhXW_UmJ7vGG3K-rh_frcLUFty_JtXWUZBzrgmBwLzqvxU9A94Zd_X2cpji1SpuHUb6wA4z5ZEyfelbHZYk3KxrzfKG15CM5eS-YR_p29p9_iTTGwmbRGYCqJvJb-vIcXLmeKfzDYmPkC15JFuB8U744GArFo3VkzOm4uuZIXU379rnFqR7VnkR6GAMy0",
  },
];

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

export function ProductDetailClient() {
  const addItem = useCartStore((state) => state.addItem);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColour, setSelectedColour] = useState(COLOURS[0].name);
  const [selectedSize, setSelectedSize] = useState("4-5Y");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: "signature-up-down-tracksuit-set",
      name: PRODUCT.name,
      price: PRODUCT.price,
      quantity,
      imageUrl: GALLERY_IMAGES[0].src,
      selectedColour,
      selectedSize,
      variationId: null,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const handleQuickAddRelated = (product: (typeof RELATED_PRODUCTS)[number]) => {
    addItem({
      productId: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      selectedColour: null,
      selectedSize: null,
      variationId: null,
    });
  };

  return (
    <main className="bg-surface">
      {/* ── Breadcrumb ── */}
      <div className="w-full bg-surface-container-low/60 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 text-xs text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-primary transition-colors">
            Boys Streetwear
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href="/shop/streetwear-tracksuits"
            className="hover:text-primary transition-colors"
          >
            Tracksuits &amp; Sets
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-on-surface font-semibold truncate">
            Signature Up &amp; Down Set (2026 Edition)
          </span>
        </div>
      </div>

      {/* ── Main PDP ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 flex-shrink-0">
              {GALLERY_IMAGES.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-surface-container transition-all shadow-sm",
                    activeImage === index
                      ? "ring-2 ring-primary"
                      : "hover:ring-2 hover:ring-primary/60"
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={cn(
                      "object-cover object-center",
                      image.detail && "object-top scale-150"
                    )}
                    sizes="80px"
                  />
                  {image.detail && (
                    <span className="absolute bottom-1 right-1 bg-surface/90 text-primary rounded px-1 text-[9px] font-bold uppercase tracking-wider">
                      DETAIL
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="relative flex-1 rounded-2xl overflow-hidden bg-surface-container-low shadow-sm aspect-[4/5] sm:aspect-auto sm:min-h-[580px]">
              <Image
                src={GALLERY_IMAGES[activeImage].src}
                alt={GALLERY_IMAGES[activeImage].alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                <span className="bg-surface-container-high/90 backdrop-blur-md text-primary text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  New Arrival • 2026 Drop
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
                {PRODUCT.categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                <BadgeCheck className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                Aba Handcrafted
              </span>
            </div>

            <h1 className="font-display text-3xl lg:text-[34px] text-on-surface leading-tight font-semibold">
              {PRODUCT.name}
            </h1>

            <div className="flex items-baseline gap-3 bg-surface-container-low p-3 rounded-xl">
              <span className="text-[22px] font-extrabold text-on-surface">
                {formatNaira(PRODUCT.price)}
              </span>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {PRODUCT.description}
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
                      "relative w-9 h-9 rounded-full shadow-sm transition-all",
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
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
                >
                  <Ruler className="w-4 h-4" strokeWidth={1.75} />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "py-2 text-center rounded-lg text-[13px] font-semibold uppercase transition-all",
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
                <Ruler className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
                True to size with generous room for growth.
              </p>
            </div>

            {/* Quantity + add to cart */}
            <div className="pt-1 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl bg-surface-container-high p-1">
                  <button
                    aria-label="Decrease quantity"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface transition-colors"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <span className="w-10 text-center text-base font-bold text-on-surface">
                    {quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface transition-colors"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary py-3.5 px-4 rounded-xl text-[13px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                  {added
                    ? "Added to Cart ✓"
                    : `Add To Cart • ${formatNaira(PRODUCT.price * quantity)}`}
                </button>
              </div>

              <a
                className="w-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#14532D] py-2.5 px-4 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-colors"
                href={`https://wa.me/2347039315917?text=Hello%20Styled%20by%20Uriel,%20I%20want%20to%20order%20the%20${encodeURIComponent(PRODUCT.name)}%20(Size:%20${selectedSize},%20${selectedColour})`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" strokeWidth={2} />
                Instant WhatsApp Order &amp; Custom Fit Check
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
          <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-surface-container-low/40 p-1.5 rounded-xl max-w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                  activeTab === tab.id
                    ? "bg-primary-container text-on-primary-container shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
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
                      this two-piece set pairs runway-worthy design with all-day
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
                  src={GALLERY_IMAGES[1].src}
                  alt="Tactile fabric detail"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-brown/80 via-brand-dark-brown/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-beige">
                    Crafted in Aba, Abia State
                  </span>
                  <p className="text-lg font-bold text-white mt-1">
                    Heavyweight Brushed Fleece
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

      {/* ── Complete the look ── */}
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
            {RELATED_PRODUCTS.map((product) => (
              <div
                key={product.slug}
                className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="relative aspect-square bg-surface-container-low overflow-hidden"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </Link>
                <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {product.category}
                    </span>
                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-extrabold text-on-surface">
                      {formatNaira(product.price)}
                    </span>
                    <button
                      type="button"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={() => handleQuickAddRelated(product)}
                      className="w-9 h-9 rounded-lg bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center"
                    >
                      <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Size guide modal ── */}
      {showSizeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowSizeModal(false)}
        >
          <div
            className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ruler className="w-6 h-6 text-primary" strokeWidth={1.75} />
                <h3 className="text-lg font-bold text-on-surface">
                  Nigerian Kids Sizing Chart
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface"
                aria-label="Close size guide"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
            <p className="text-sm text-on-surface-variant">
              Children in Nigeria grow fast and need freedom of movement for
              active play. If your child is between sizes, choose the larger
              size.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
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
            <div className="flex justify-end gap-3 pt-2">
              <a
                className="text-primary text-[13px] font-semibold flex items-center gap-1 hover:underline"
                href="https://wa.me/2347039315917?text=Hi%20Natasha,%20I%20need%20help%20choosing%20the%20right%20size%20for%20my%20child"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
                Ask Natasha on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-[13px] font-bold"
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
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowZoomModal(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-surface rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface">
              <span className="text-sm font-bold text-on-surface">
                {GALLERY_IMAGES[activeImage].alt}
              </span>
              <button
                type="button"
                onClick={() => setShowZoomModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface"
                aria-label="Close image zoom"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] bg-black">
              <Image
                src={GALLERY_IMAGES[activeImage].src}
                alt={GALLERY_IMAGES[activeImage].alt}
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
