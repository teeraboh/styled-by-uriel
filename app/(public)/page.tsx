import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustStrip } from "@/components/layout/trust-strip";
import { PromoBanner } from "@/components/layout/promo-banner";
import { ProductCarousel } from "@/components/product/product-carousel";
import { FeaturedProductCard } from "@/components/product/featured-product-card";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-zqxQF_38DL3P38cxxb5ET4ksNMu1N5JkWG7VH92B5SkSOaDVWrS8XtxfIdmjed-qj60cZmmakqzoB-IPKExFkhGdUFljLJLU6GviCNhG_gdgcwX2KKz7DHV7QD4Jc9lQkJcIz6dNjmpBrd6ea1liLrAMoLtFqKkO5SuX7bvYQ_-EDx8WnN-lseVIE0cqs44Nyeqa69t7uxtYlHU9tcK4r1XwR1ZWSd4cIVYtZtzjqlRjRF6WFtde";

const FEATURED_FALLBACK_PRODUCTS = [
  {
    id: "california-ringer-tee",
    slug: "california-ringer-tee",
    name: "California Ringer Tee",
    price: 15000,
    tagline: "Vintage Coastal Fit",
    description: "Breathable cotton classic streetwear ringer tee.",
    badge: "New Arrival",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-zqxQF_38DL3P38cxxb5ET4ksNMu1N5JkWG7VH92B5SkSOaDVWrS8XtxfIdmjed-qj60cZmmakqzoB-IPKExFkhGdUFljLJLU6GviCNhG_gdgcwX2KKz7DHV7QD4Jc9lQkJcIz6dNjmpBrd6ea1liLrAMoLtFqKkO5SuX7bvYQ_-EDx8WnN-lseVIE0cqs44Nyeqa69t7uxtYlHU9tcK4r1XwR1ZWSd4cIVYtZtzjqlRjRF6WFtde",
  },
  {
    id: "utility-cargo-shorts",
    slug: "utility-cargo-shorts",
    name: "Utility Cargo Shorts",
    price: 14000,
    tagline: "Streetwear Utility",
    description: "Durable twill weave equipped with multi pockets.",
    badge: "Trending",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCtET4mleNPdfH5mdz-6X2fwBzFVRvLNd-93RWbe7qgpziq2UbOdvStSo0pR-m6zfU5peUPq6a15YRGP4HJCcYj59S5Y9iactfT-O-eHf_zhLXTiakrSyXK22ar_X6rwRNxxy3acG6uq_Fmn9DEtGmp5WBr47jO1psTEHkbfhmnnOpxmX7tOm-r23NLib4Pms0GtVAxUQizLN2W8KGTEpYXcfZC4gHb5EIQ5VRX3_1RmfD-5IkUu43q",
  },
  {
    id: "up-and-down-tracksuit",
    slug: "up-and-down-tracksuit",
    name: "Up & Down Tracksuit",
    price: 25000,
    tagline: "Signature Streetwear",
    description: "Heavyweight cotton fleece with custom embossed patches.",
    featured: true,
    badge: "Best Seller",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6dXaH40JoHHWCO40XlsVPmmjX6nQ1AgXIg8lflfUgkU3_SJCU_uQi9h2cOhNDluGWINrIS8_1VZQOLbVzqHCS_W48-YZDUfmgdqeFqvsjR8yGZ0_b-XU06DGOXBORdQQ3gEV6cIY-cKhlyZRI6l_ZQHUFzXSFj0vVgjgxVTUJ_ohPAXxM0AKSJ8UwzMBTzpqbZKMHj03pwgRaepeavQ19lppcg8NAposKizkZjkugnH4p3qEmsHbT",
  },
  {
    id: "jeans-trousers",
    slug: "jeans-trousers",
    name: "Jeans Trousers",
    price: 17000,
    tagline: "Washed Denim Cargo",
    description: "Washed dark charcoal denim with deep utility cargo pockets.",
    badge: "Popular",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQTH7zLlYNfoCRUlrgAJIsiZEXO-gA7CCdx1LltnV81oAX86uitwQTpcEPL5ztWY2Mh4xWvpEF1BLZRuYJ9uhD_v5Fhfp9KDv_jm6c_8f7-XUcWG5djvtS1Tt_T47vhem6IcM3lgVUMd3Yh6_7OZskZyVUX_bk1GBHhmtqais2PkKax_lyTjeLuURBvVz_4LhLJgltSCC_phWBcv7IleEYihxiE5SBAE8LSeYEMWOm2HcPwuciTHHq",
  },
  {
    id: "track-zip-jacket",
    slug: "track-zip-jacket",
    name: "Track Zip Jacket",
    price: 22000,
    tagline: "Cozy Fleece Outerwear",
    description: "Branded collegiate patch embroidery on premium tan fleece.",
    badge: "Exclusive",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6dXaH40JoHHWCO40XlsVPmmjX6nQ1AgXIg8lflfUgkU3_SJCU_uQi9h2cOhNDluGWINrIS8_1VZQOLbVzqHCS_W48-YZDUfmgdqeFqvsjR8yGZ0_b-XU06DGOXBORdQQ3gEV6cIY-cKhlyZRI6l_ZQHUFzXSFj0vVgjgxVTUJ_ohPAXxM0AKSJ8UwzMBTzpqbZKMHj03pwgRaepeavQ19lppcg8NAposKizkZjkugnH4p3qEmsHbT",
  },
];

const HERO_BADGES = [
  { icon: Sparkles, title: "Premium", subtitle: "Quality" },
  { icon: Heart, title: "Trendy", subtitle: "Styles" },
  { icon: ShieldCheck, title: "Kids", subtitle: "Comfort First" },
] as const;

// Hero model background URL matching Stitch screen b3907a793741427d9cbf36c70e05164f
const HERO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida/AEtjO1VwpoTVa0fyucjCWq-98pOhNIGGjNZQgS_umFMWJILwN_oBOf1OCWDKM3pK1tZ9Mnk-B_yESV_6U7IMdtxABr8JTkfJPaDE6PxOKqTlzWKxT-dWAwG_bDY0FKT-ycGss1xWu0aJzhX5uhKb4d_zyveAyUJ7MFiQkL8Xe2vwfj_vb2ehJ0nhAy6jckQtz-UiAxztGAYJfydNvXTdrzQFWlNq1Q1nDyU59U_zslTzI-XCCmNfg0uaBSfZJkw";

export default async function HomePage() {
  const products = await getProducts({ limit: 6 });
  const displayProducts = products.length > 0 ? products : FEATURED_FALLBACK_PRODUCTS;

  return (
    <main>
      {/* ── 1. Hero Section (with full-bleed model & gradient readability layer) ── */}
      <section className="relative bg-brand-ivory overflow-hidden" data-purpose="hero-banner">
        <div className="relative w-full bg-brand-ecru overflow-hidden min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] flex items-center">
          {/* Background Image with Boy Model */}
          <div className="absolute inset-0 w-full h-full select-none pointer-events-none animate-hero-image">
            <Image
              src={HERO_IMAGE_URL}
              alt="Styled by Uriel Kids Streetwear Model"
              fill
              className="object-cover object-[68%_center]"
              priority
              sizes="100vw"
            />
            {/* Gradient overlay on the left to guarantee optimal readability of text while keeping boy model fully visible */}
            <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-brand-cream via-brand-cream/90 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-cream/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Hero Content Grid */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 w-full z-10 flex flex-col justify-between min-h-[400px] sm:min-h-[460px] lg:min-h-[520px]">
            {/* Top row: Right floating script slogan */}
            <div className="flex justify-end w-full animate-hero-fade-in [animation-delay:100ms]">
              <div className="hidden md:block transform rotate-2 text-right pt-1 select-none pointer-events-none">
                <p className="font-script text-2xl sm:text-3xl lg:text-4xl text-brand-warm-brown leading-none drop-shadow-sm font-bold">
                  Fashion
                  <br />
                  for brighter
                  <br />
                  tomorrows ♡
                </p>
              </div>
            </div>

            {/* Center row: Left-aligned typography and CTA */}
            <div className="max-w-xl lg:max-w-md my-auto pt-1 pb-3">
              {/* Eyebrow text */}
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-2 animate-hero-slide-eyebrow [animation-delay:120ms]">
                PREMIUM KIDS FASHION
              </p>

              {/* Main Headline */}
              <div className="mb-3 sm:mb-4 animate-hero-slide-heading [animation-delay:200ms]">
                <h1 className="font-display text-on-surface font-bold text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] tracking-tight">
                  Little
                  <br />
                  Styles
                </h1>
                <div className="font-script text-primary text-4xl sm:text-5xl lg:text-6xl -mt-1 -rotate-2 font-bold tracking-normal drop-shadow-xs">
                  Big Stories
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed max-w-sm sm:max-w-md mb-5 animate-hero-slide-sub [animation-delay:300ms]">
                Trendy. Comfortable. Affordable.
                <br className="hidden sm:inline" /> Styled for every moment.
              </p>

              {/* CTA Button */}
              <div className="mb-6 animate-hero-slide-cta [animation-delay:380ms]">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-6 sm:px-7 py-3 bg-primary hover:bg-brand-warm-brown-dark text-on-primary text-xs sm:text-[13px] uppercase tracking-wider font-bold shadow-lg hover:shadow-2xl transition-all transform active:scale-95 hover-lift inline-flex items-center gap-2.5"
                >
                  <Link href="/shop">
                    <span>SHOP THE COLLECTION</span>
                    <span className="text-base leading-none">→</span>
                  </Link>
                </Button>
              </div>

              {/* 3 Feature badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-3.5 border-t border-brand-beige/80">
                {HERO_BADGES.map(({ icon: Icon, title, subtitle }, index) => (
                  <div
                    key={title}
                    className="flex items-center gap-2 animate-hero-slide-badge"
                    style={{ animationDelay: `${460 + index * 60}ms` }}
                  >
                    <div className="text-primary shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
                    </div>
                    <div className="leading-tight">
                      <p className="text-xs font-semibold text-on-surface">{title}</p>
                      <p className="text-[10px] text-on-surface-variant">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row: Right corner logo badge */}
            <div className="hidden md:flex justify-end w-full animate-hero-slide-emblem [animation-delay:620ms]">
              <div className="bg-brand-cream/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-brand-beige/80 shadow-md flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-300">
                <div className="font-display font-bold text-primary tracking-tight flex items-center gap-1.5">
                  <span className="font-script text-xl leading-none text-primary">
                    Styled
                  </span>
                  <span className="font-display italic text-xs text-primary">by</span>
                  <span className="font-display font-black text-base text-on-surface">
                    Uriel
                  </span>
                </div>
                <p className="text-[9px] font-bold tracking-[0.25em] text-primary uppercase mt-0.5">
                  Cute · Comfy · Stylish
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Trust Proposition Strip ── */}
      <TrustStrip />

      {/* ── 3. Collections & Featured Products Carousel ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-brand-cream" data-purpose="product-collection" id="collections">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with individual 45-degree angled editorial highlight strips */}
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span
              style={{ clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)" }}
              className="inline-block bg-brand-beige text-brand-dark-brown text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] px-5 sm:px-6 py-1"
            >
              OUR COLLECTION
            </span>

            <h2
              style={{ clipPath: "polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)" }}
              className="inline-block bg-brand-beige text-brand-dark-brown font-display text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight leading-none px-8 sm:px-12 py-2.5 sm:py-3.5 -mt-0.5"
            >
              Featured Products
            </h2>

            <p
              style={{ clipPath: "polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)" }}
              className="inline-block bg-brand-beige text-brand-dark-brown text-xs sm:text-sm md:text-base font-medium px-6 sm:px-8 py-1 -mt-0.5"
            >
              Explore our most popular items loved by customers across Nigeria
            </p>
          </div>

          {/* Product Carousel with live Supabase products or curated featured fallbacks */}
          {displayProducts.length > 0 && (
            <ProductCarousel
              dotCount={displayProducts.length}
              initialActiveIndex={0}
            >
              {displayProducts.map((product, index) => {
                const rawImageUrl =
                  "images" in product && product.images?.[0]?.image_url
                    ? product.images[0].image_url
                    : "imageUrl" in product
                    ? (product as unknown as { imageUrl: string }).imageUrl
                    : FALLBACK_IMAGE;

                const fallbackUrl =
                  FEATURED_FALLBACK_PRODUCTS[index % FEATURED_FALLBACK_PRODUCTS.length]
                    ?.imageUrl || FALLBACK_IMAGE;

                const imageUrl =
                  !rawImageUrl || rawImageUrl.includes("/aida/AEtjO1")
                    ? fallbackUrl
                    : rawImageUrl;

                const badge =
                  "stock_quantity" in product &&
                  product.stock_quantity <= 4 &&
                  product.stock_quantity > 0
                    ? "Low Stock"
                    : index === 0
                    ? "Best Seller"
                    : "badge" in product
                    ? (product as unknown as { badge?: string }).badge
                    : undefined;

                const tagline =
                  "category" in product && product.category?.name
                    ? product.category.name
                    : "tagline" in product
                    ? (product as unknown as { tagline?: string }).tagline
                    : "Boutique Garment";

                return (
                  <FeaturedProductCard
                    key={product.id || product.slug}
                    productId={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    imageUrl={imageUrl}
                    tagline={tagline}
                    description={
                      product.description ||
                      `${product.name} • Handcrafted in Aba`
                    }
                    badge={badge}
                    featured={index === 0}
                    href={`/product/${product.slug}`}
                  />
                );
              })}
            </ProductCarousel>
          )}
        </div>
      </section>

      {/* ── 4. Feature Promotional Banner ── */}
      <PromoBanner href="/shop" />
    </main>
  );
}
