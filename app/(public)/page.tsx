import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustStrip } from "@/components/layout/trust-strip";
import { PromoBanner } from "@/components/layout/promo-banner";
import { ProductCarousel } from "@/components/product/product-carousel";
import { FeaturedProductCard } from "@/components/product/featured-product-card";

// Temporary placeholder product data matching Stitch screen b3907a793741427d9cbf36c70e05164f
const FEATURED_PRODUCTS = [
  {
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

export default function HomePage() {
  return (
    <main>
      {/* ── 1. Hero Section (with full-bleed model & gradient readability layer) ── */}
      <section className="relative bg-brand-ivory overflow-hidden" data-purpose="hero-banner">
        <div className="relative w-full bg-brand-ecru overflow-hidden min-h-[500px] lg:min-h-[560px] flex items-center">
          {/* Background Image with Boy Model */}
          <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
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
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 w-full z-10 flex flex-col justify-between min-h-[460px] lg:min-h-[520px]">
            {/* Top row: Right floating script slogan */}
            <div className="flex justify-end w-full">
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
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-brand-warm-brown mb-2">
                PREMIUM KIDS FASHION
              </p>

              {/* Main Headline */}
              <div className="mb-3 sm:mb-4">
                <h1 className="font-display text-brand-dark-brown font-black text-5xl sm:text-6xl lg:text-[64px] leading-[0.95] tracking-tight">
                  Little
                  <br />
                  Styles
                </h1>
                <div className="font-script text-brand-warm-brown text-4xl sm:text-5xl lg:text-6xl -mt-1 -rotate-2 font-bold tracking-normal drop-shadow-xs">
                  Big Stories
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm lg:text-base text-brand-dark-brown font-medium leading-relaxed max-w-sm sm:max-w-md mb-5">
                Trendy. Comfortable. Affordable.
                <br className="hidden sm:inline" /> Styled for every moment.
              </p>

              {/* CTA Button */}
              <div className="mb-6">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-6 sm:px-7 py-3 bg-brand-warm-brown hover:bg-brand-warm-brown-dark text-white text-xs sm:text-sm uppercase tracking-wider font-bold shadow-lg hover:shadow-2xl transition-all transform active:scale-95 hover-lift inline-flex items-center gap-2.5"
                >
                  <Link href="/shop">
                    <span>SHOP THE COLLECTION</span>
                    <span className="text-base leading-none">→</span>
                  </Link>
                </Button>
              </div>

              {/* 3 Feature badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-3.5 border-t border-brand-beige/80">
                {HERO_BADGES.map(({ icon: Icon, title, subtitle }) => (
                  <div key={title} className="flex items-center gap-2">
                    <div className="text-brand-warm-brown shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
                    </div>
                    <div className="leading-tight">
                      <p className="text-xs font-semibold text-brand-dark-brown">{title}</p>
                      <p className="text-[10px] text-on-surface-variant">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row: Right corner logo badge */}
            <div className="hidden md:flex justify-end w-full">
              <div className="bg-brand-cream/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-brand-beige/80 shadow-md flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-300">
                <div className="font-display font-bold text-brand-warm-brown tracking-tight flex items-center gap-1.5">
                  <span className="font-script text-xl leading-none text-brand-warm-brown">
                    Styled
                  </span>
                  <span className="font-display italic text-xs text-brand-warm-brown">by</span>
                  <span className="font-display font-black text-base text-brand-dark-brown">
                    Uriel
                  </span>
                </div>
                <p className="text-[9px] font-bold tracking-[0.25em] text-brand-warm-brown uppercase mt-0.5">
                  Cute · Comfy · Stylish
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Trust Proposition Strip (placed DIRECTLY BELOW Hero in this redesign) ── */}
      <TrustStrip />

      {/* ── 3. Collections & Featured Products Carousel ── */}
      <section className="py-16 lg:py-20 bg-brand-cream" data-purpose="product-collection" id="collections">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-warm-brown mb-2">
              OUR COLLECTION
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-brand-dark-brown tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2.5 font-medium">
              Explore our most popular items loved by customers
            </p>
          </div>

          {/* Product Carousel with snap-scrolling and Buy Now links */}
          <ProductCarousel
            dotCount={FEATURED_PRODUCTS.length}
            initialActiveIndex={Math.max(
              FEATURED_PRODUCTS.findIndex((product) => product.featured),
              0
            )}
          >
            {FEATURED_PRODUCTS.map((product) => (
              <FeaturedProductCard
                key={product.slug}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                tagline={product.tagline}
                description={product.description}
                badge={product.badge}
                href={`/product/${product.slug}`}
              />
            ))}
          </ProductCarousel>
        </div>
      </section>

      {/* ── 4. Feature Promotional Banner ── */}
      <PromoBanner href="/shop" />
    </main>
  );
}
