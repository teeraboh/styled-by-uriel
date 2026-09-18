"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, Truck, BadgeCheck, MessageCircle } from "lucide-react";
import { ShopProductCard } from "@/components/product/shop-product-card";
import { cn } from "@/lib/utils";

// ── Temporary placeholder catalog — will be replaced with Supabase queries ──
// Stitch-generated images and copy are dev placeholders (PRD §15).
const IMG_TRACKSUIT =
  "https://lh3.googleusercontent.com/aida/AEtjO1Xgzlvx5oI4TZhJrEZglLEzJltz-LpPJ6KKwatmoNQ5wPPTpwapFY9QrpQf6NVb152Yfx7o-4VcD1yVUWbXR4ljhHRIqg9S0tF198a5TMXadgn-AKKmx2mRAfKLVJ8RLZmJ61He5sGOUIV23vlOdglwXV1Edh10UX7LwEVjsXCNLuWqwOKn5odHMRLIOdTnU8kJDFA3vY7z4iKjah3-aag8BbafBIcniNnU5yQnLu9K1PyosXdV1EPkKy8";
const IMG_TEE =
  "https://lh3.googleusercontent.com/aida/AEtjO1UNGbh2Vydr4Elt1NIZop3F6TtBSVg95Qdi-m6yvH2DNFDJD_aP4L4dseK5CYqQsUzQiNJ7Z_wLZQYItoT9UUANh_mkZKW2aaQUwTOw2NKemf-Ncex5grs1N29ABimQ-s2Z1ChDTINMI7ZrxLdD0bkQ0AIkKA1zyEvsQQF0taWNPNrlTN7Cim9OzjQG2ByaNab_fipnsGXcblMuNcwVst2sZwgY23guuBFWMI0dGTugSE_F44ayA9V7EVs";
const IMG_DENIM =
  "https://lh3.googleusercontent.com/aida/AEtjO1VZFGAF20LCOV1QXdhtNxhydXUSDcVQbN3g_RGl_JLEtVj2F-7RbNQ2aJgOPQtKDi87ii4J1r4VFM9q31P20XeLSrAIxrfTtvrJV6uks_Ck36Ah4RC39jBV8zL2OdURjaMM11AE26HyeSZM1qJBkMpFnjsLQ_9grVzifAyt6-BwjQOz7IP7SlWRV_a_B--rmzv3J0O62UG0wkHdYd6xxKuoVDQFeisgKy6yiGtcaZpq4QbDeLUqMI8miL0";
const IMG_CARGO_SET =
  "https://lh3.googleusercontent.com/aida/AEtjO1X14Ge7JzgTfg_YnNkpFzA4834yb99ZXiZ9TwB8TztYn6KecTnsfPoYJxz3CUJhXW_UmJ7vGG3K-rh_frcLUFty_JtXWUZBzrgmBwLzqvxU9A94Zd_X2cpji1SpuHUb6wA4z5ZEyfelbHZYk3KxrzfKG15CM5eS-YR_p29p9_iTTGwmbRGYCqJvJb-vIcXLmeKfzDYmPkC15JFuB8U744GArFo3VkzOm4uuZIXU379rnFqR7VnkR6GAMy0";

interface ShopProduct {
  slug: string;
  name: string;
  price: number;
  category: string;
  categoryLabel: string;
  description: string;
  ages: string;
  minAge: number;
  maxAge: number;
  imageUrl: string;
  badge?: string;
}

const PRODUCTS: ShopProduct[] = [
  {
    slug: "up-and-down-tracksuit",
    name: "Up & Down (Tracksuit)",
    price: 25000,
    category: "tracksuits",
    categoryLabel: "Two-Piece Streetwear",
    description:
      "Luxury tan beige streetwear jacket & jogger set with custom embroidery patches.",
    ages: "4Y - 10Y",
    minAge: 4,
    maxAge: 10,
    imageUrl: IMG_TRACKSUIT,
  },
  {
    slug: "california-ringer-tee",
    name: "California Ringer Tee",
    price: 15000,
    category: "tees",
    categoryLabel: "Everyday Casual Tee",
    description:
      "Premium vintage cream ringer tee with retro golden typography and contrasting trim.",
    ages: "2Y - 12Y",
    minAge: 2,
    maxAge: 12,
    imageUrl: IMG_TEE,
    badge: "New Arrival",
  },
  {
    slug: "denim-cargo-utility-jeans",
    name: "Denim Cargo Utility Jeans",
    price: 17000,
    category: "denim",
    categoryLabel: "Denim Bottoms",
    description:
      "Washed dark charcoal denim trousers with flap cargo utility pockets and comfortable elastic waist.",
    ages: "4Y - 12Y",
    minAge: 4,
    maxAge: 12,
    imageUrl: IMG_DENIM,
  },
  {
    slug: "beige-cargo-jogger-shorts-set",
    name: "Beige Cargo Jogger & Shorts Set",
    price: 22000,
    category: "shorts",
    categoryLabel: "Multi-Piece Combo",
    description:
      "Minimalist neutral tan streetwear jogger combo with utility crossbody bag and knit beanie.",
    ages: "3Y - 10Y",
    minAge: 3,
    maxAge: 10,
    imageUrl: IMG_CARGO_SET,
  },
  {
    slug: "california-state-vintage-polo",
    name: "California State Vintage Polo",
    price: 15000,
    category: "tees",
    categoryLabel: "Heritage Collars",
    description:
      "Contrasting navy collar cream cotton polo with fine stitch details and airy lightweight breathability.",
    ages: "3Y - 11Y",
    minAge: 3,
    maxAge: 11,
    imageUrl: IMG_TEE,
  },
  {
    slug: "urban-cargo-street-trousers",
    name: "Urban Cargo Street Trousers",
    price: 17000,
    category: "denim",
    categoryLabel: "Heavyweight Denim",
    description:
      "Reinforced knee stitching, relaxed fit washed black denim with adjustable interior waistband.",
    ages: "5Y - 12Y",
    minAge: 5,
    maxAge: 12,
    imageUrl: IMG_DENIM,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "tracksuits", label: "Tracksuits & Sets" },
  { id: "tees", label: "Tees & Polos" },
  { id: "denim", label: "Denim & Cargo" },
  { id: "shorts", label: "Shorts & Joggers" },
] as const;

const AGE_PILLS = [
  { label: "2-3Y", min: 2, max: 3 },
  { label: "4-5Y", min: 4, max: 5 },
  { label: "6-7Y", min: 6, max: 7 },
  { label: "8-10Y", min: 8, max: 10 },
  { label: "11-12Y", min: 11, max: 12 },
] as const;

const PRICE_RANGES = [
  { id: "all", label: "All Prices" },
  { id: "under15", label: "Under ₦15,000" },
  { id: "15to25", label: "₦15,000 - ₦25,000" },
  { id: "above25", label: "₦25,000 & Above" },
] as const;

function matchesPrice(price: number, range: string): boolean {
  switch (range) {
    case "under15":
      return price < 15000;
    case "15to25":
      return price >= 15000 && price <= 25000;
    case "above25":
      return price > 25000;
    default:
      return true;
  }
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [age, setAge] = useState<{ min: number; max: number } | null>(null);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        search.trim() === "" ||
        `${product.name} ${product.description}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());
      const priceMatches = matchesPrice(product.price, priceRange);
      const matchesAge = !age || (product.minAge <= age.max && product.maxAge >= age.min);
      return matchesCategory && matchesSearch && priceMatches && matchesAge;
    });

    if (sort === "low-high") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [activeCategory, search, sort, priceRange, age]);

  return (
    <main className="bg-surface min-h-screen">
      {/* ── Catalog Hero ── */}
      <section className="relative w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-10 sm:py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-px bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
                Aba Handcrafted Luxury Drops
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-on-surface font-semibold leading-tight">
              All Children&apos;s Streetwear &amp; Essentials
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Discover comfortable, stylish statement pieces crafted for
              energetic play and special moments. Tailored with care in Abia
              State for modern young dreamers across Nigeria.
            </p>
          </div>

          {/* Artisan badge */}
          <div className="flex items-center gap-4 bg-surface-container-highest px-4 py-2.5 rounded-xl shadow-sm self-start md:self-auto">
            <BadgeCheck className="w-7 h-7 text-primary" strokeWidth={1.75} />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-on-surface">
                Aba Artisan Standard
              </span>
              <span className="text-xs text-on-surface-variant">
                Handcrafted in Abia State
              </span>
            </div>
          </div>
        </div>
        <div className="absolute -right-16 -top-24 w-96 h-96 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none" />
      </section>

      {/* ── Filter / Search Toolbar ── */}
      <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-4 shadow-sm sticky top-20 z-30 backdrop-blur-md bg-surface/95">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Category pills + search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-2 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all",
                    activeCategory === cat.id
                      ? "bg-primary-container text-on-primary-container shadow-sm"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative min-w-[260px] md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5"
                strokeWidth={1.75}
              />
              <input
                className="w-full bg-surface-container-low pl-10 pr-12 py-2 rounded-lg text-on-surface text-sm placeholder:text-outline focus:outline-none focus:bg-surface-container transition-all"
                placeholder="Search shirts, tracksuits, jeans..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search products"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-widest bg-surface-container-high text-primary px-1.5 py-0.5 rounded">
                LIVE
              </span>
            </div>
          </div>

          {/* Sort / price / age */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort */}
              <div className="relative inline-flex items-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mr-2">
                  Sort:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-surface-container-low hover:bg-surface-container text-on-surface text-[13px] font-semibold py-1.5 pl-3 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none transition-colors"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured Drops</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="newest">New Arrivals</option>
                </select>
                <ChevronDown className="absolute right-2 pointer-events-none w-4 h-4 text-outline" />
              </div>

              {/* Price */}
              <div className="relative inline-flex items-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mr-2">
                  Price:
                </span>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-surface-container-low hover:bg-surface-container text-on-surface text-[13px] font-semibold py-1.5 pl-3 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none transition-colors"
                  aria-label="Filter by price"
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 pointer-events-none w-4 h-4 text-outline" />
              </div>

              {/* Age pills */}
              <div className="hidden sm:flex items-center gap-1 ml-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mr-1">
                  Ages:
                </span>
                {AGE_PILLS.map((pill) => (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() =>
                      setAge(
                        age?.min === pill.min && age?.max === pill.max
                          ? null
                          : { min: pill.min, max: pill.max }
                      )
                    }
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-semibold transition-colors",
                      age?.min === pill.min && age?.max === pill.max
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary"
                    )}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-on-surface-variant ml-auto">
              <strong className="text-on-surface font-semibold">
                {filtered.length}
              </strong>{" "}
              of {PRODUCTS.length} pieces
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-on-surface-variant text-base mb-4">
                No products match your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearch("");
                  setPriceRange("all");
                  setAge(null);
                }}
                className="text-primary font-semibold underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ShopProductCard
                  key={product.slug}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  categoryLabel={product.categoryLabel}
                  description={product.description}
                  ages={product.ages}
                  badge={product.badge}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Lookbook Ribbon ── */}
      <section className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-3 max-w-lg">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Tailored for Little Icons
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-on-surface font-semibold leading-tight">
              Kids Fashion for Brighter Tomorrows
            </h2>
            <p className="text-sm text-on-surface-variant">
              Every piece is designed with room to grow, soft breathable fibers
              for Nigeria&apos;s sunny climate, and durable construction that
              survives playground adventures without losing its runway charm.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-4 py-2.5 rounded-lg text-[13px] font-semibold uppercase tracking-wider shadow-sm transition-colors"
                href="https://wa.me/2347039315917?text=Hi%20Natasha,%20I%20would%20like%20to%20request%20a%20custom%20order%20for%20my%20kids!"
                rel="noopener noreferrer"
                target="_blank"
              >
                Request Custom Sizing
                <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
              </a>
              <span className="text-xs text-on-surface-variant">
                Bulk &amp; Birthday orders welcome
              </span>
            </div>
          </div>

          {/* Assurance strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
            {[
              {
                icon: Truck,
                title: "Fast Dispatch from Aba",
                text: "Direct courier routes to Lagos, Abuja, Port Harcourt, and nationwide across Nigeria.",
              },
              {
                icon: BadgeCheck,
                title: "Authentic Craft",
                text: "Original Styled by Uriel patterns made under Natasha Ezinne's tailoring eye.",
              },
              {
                icon: MessageCircle,
                title: "Instant WhatsApp Orders",
                text: "Speak with our Aba studio to confirm custom measurements or quick dispatch.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3 p-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-on-surface">{title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pagination bar ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 rounded-2xl">
          <div className="text-sm text-on-surface-variant">
            Showing{" "}
            <span className="font-bold text-on-surface">1 - {filtered.length}</span>{" "}
            of{" "}
            <span className="font-bold text-on-surface">{PRODUCTS.length}</span>{" "}
            curated pieces
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous page"
              disabled
              className="w-10 h-10 rounded-lg bg-surface text-on-surface flex items-center justify-center opacity-50"
              type="button"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <button
              className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container text-[13px] font-bold flex items-center justify-center shadow-sm"
              type="button"
            >
              1
            </button>
            <button
              aria-label="Next page"
              disabled
              className="w-10 h-10 rounded-lg bg-surface text-on-surface flex items-center justify-center opacity-50"
              type="button"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
