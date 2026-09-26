"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronDown, Check, ArrowUpDown, CircleDollarSign, Truck, BadgeCheck, MessageCircle } from "lucide-react";
import { ShopProductCard } from "@/components/product/shop-product-card";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types";

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-zqxQF_38DL3P38cxxb5ET4ksNMu1N5JkWG7VH92B5SkSOaDVWrS8XtxfIdmjed-qj60cZmmakqzoB-IPKExFkhGdUFljLJLU6GviCNhG_gdgcwX2KKz7DHV7QD4Jc9lQkJcIz6dNjmpBrd6ea1liLrAMoLtFqKkO5SuX7bvYQ_-EDx8WnN-lseVIE0cqs44Nyeqa69t7uxtYlHU9tcK4r1XwR1ZWSd4cIVYtZtzjqlRjRF6WFtde";

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

interface ShopSelectOption {
  value: string;
  label: string;
}

const SORT_OPTIONS: ShopSelectOption[] = [
  { value: "featured", label: "Featured Drops" },
  { value: "low-high", label: "Price: Low to High" },
  { value: "high-low", label: "Price: High to Low" },
  { value: "newest", label: "New Arrivals" },
];

const PRICE_OPTIONS: ShopSelectOption[] = PRICE_RANGES.map((range) => ({
  value: range.id,
  label: range.label,
}));

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

interface ShopSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: ShopSelectOption[];
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  triggerClassName?: string;
  ariaLabel?: string;
}

function ShopSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  icon: Icon,
  triggerClassName,
  ariaLabel,
}: ShopSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", triggerClassName)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="w-full min-h-[44px] inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-white text-[#221a16] text-[13px] font-medium shadow-xs hover:bg-[#fceae3] border border-[#f0dfd8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          {Icon && <Icon className="w-4 h-4 text-[#71523c] shrink-0" />}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-[#71523c] shrink-0 transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-2 z-50 w-48 min-w-[160px] max-w-[calc(100vw-2rem)] sm:min-w-[15rem] max-h-[60vh] overflow-y-auto rounded-xl bg-white shadow-xl border border-[#f0dfd8] p-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-md text-[13px] font-medium transition-colors flex items-center gap-2",
                    isSelected
                      ? "bg-[#fff1eb] text-[#221a16]"
                      : "text-[#50453e] hover:bg-[#fedab1] hover:text-[#221a16]"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#71523c] shrink-0 ml-auto" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [age, setAge] = useState<{ min: number; max: number } | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLookbookVisible, setIsLookbookVisible] = useState(false);
  const scrollTimerRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  const lookbookRef = useRef<HTMLElement>(null);

  // Debounced scroll-stop detection
  useEffect(() => {
    const onScroll = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        setIsScrolling(true);
      }

      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }

      scrollTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        setIsScrolling(false);
        scrollTimerRef.current = null;
      }, 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  // Lookbook boundary observer
  useEffect(() => {
    const target = lookbookRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsLookbookVisible(entry.isIntersecting);
      },
      {
        rootMargin: "-64px 0px 0px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const isFilterHidden = isScrolling || isLookbookVisible;

  // Category filter items: "all" + live Supabase categories
  const categoryTabs = useMemo(() => {
    return [
      { id: "all", label: "All Items" },
      ...categories.map((c) => ({
        id: c.slug,
        label: c.name,
      })),
    ];
  }, [categories]);

  // Filter & sort live products
  const filtered = useMemo(() => {
    let list = initialProducts.filter((product) => {
      // 1. Category match
      const productCatSlug = product.category?.slug?.toLowerCase();
      const matchesCategory =
        activeCategory === "all" ||
        productCatSlug === activeCategory.toLowerCase() ||
        product.category_id === activeCategory;

      // 2. Search match
      const matchesSearch =
        search.trim() === "" ||
        `${product.name} ${product.description || ""}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      // 3. Price match
      const priceMatches = matchesPrice(product.price, priceRange);

      return matchesCategory && matchesSearch && priceMatches;
    });

    if (sort === "low-high") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      list = [...list].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return list;
  }, [initialProducts, activeCategory, search, sort, priceRange]);

  return (
    <main className="bg-surface min-h-screen">
      {/* ── Catalog Hero ── */}
      <section className="relative w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-10 sm:py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-px bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Aba Handcrafted Luxury Drops
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-on-surface font-semibold leading-tight">
              All Children&apos;s Streetwear &amp; Essentials
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
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
      <section
        className={cn(
          "w-full bg-surface px-4 sm:px-6 lg:px-8 py-4 shadow-sm sticky top-16 z-40 transition-opacity duration-200",
          isFilterHidden
            ? "opacity-0 pointer-events-none invisible"
            : "opacity-100 pointer-events-auto visible"
        )}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Category pills + search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {categoryTabs.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "min-h-[40px] px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    activeCategory === cat.id
                      ? "bg-primary-container text-on-primary-container shadow-sm font-bold"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80 min-w-0">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4 pointer-events-none"
                strokeWidth={1.75}
              />
              <input
                className="w-full min-h-[44px] bg-surface-container-low pl-10 pr-14 py-2.5 rounded-lg text-on-surface text-sm placeholder:text-outline focus:outline-none focus:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary transition-all"
                placeholder="Search shirts, tracksuits..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search products"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest bg-surface-container-high text-primary px-1.5 py-0.5 rounded pointer-events-none">
                LIVE
              </span>
            </div>
          </div>

          {/* Sort / price / age */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Sort */}
              <ShopSelect
                value={sort}
                onChange={setSort}
                options={SORT_OPTIONS}
                placeholder="Featured Drops"
                icon={ArrowUpDown}
                ariaLabel="Sort products"
                triggerClassName="w-full xs:w-auto flex-1 min-w-0 sm:min-w-[150px]"
              />

              {/* Price */}
              <ShopSelect
                value={priceRange}
                onChange={setPriceRange}
                options={PRICE_OPTIONS}
                placeholder="All Prices"
                icon={CircleDollarSign}
                ariaLabel="Filter by price"
                triggerClassName="w-full xs:w-auto flex-1 min-w-0 sm:min-w-[150px]"
              />

              {/* Age pills */}
              <div className="hidden sm:flex items-center gap-1 ml-1">
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
                      "px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer",
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

            <div className="text-xs text-on-surface-variant self-end sm:self-auto sm:ml-auto">
              <strong className="text-on-surface font-semibold">
                {filtered.length}
              </strong>{" "}
              of {initialProducts.length} live pieces
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 sm:py-20 bg-surface-container-lowest rounded-2xl border border-[#f0dfd8]/60 p-6 sm:p-8">
              <p className="text-on-surface-variant text-base mb-4 font-medium">
                No active products match your current filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearch("");
                  setPriceRange("all");
                  setAge(null);
                }}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-[13px] font-bold uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => {
                const rawImageUrl = product.images?.[0]?.image_url;
                const imageUrl =
                  !rawImageUrl || rawImageUrl.includes("/aida/AEtjO1")
                    ? FALLBACK_IMAGE
                    : rawImageUrl;
                const badge =
                  product.stock_quantity <= 4 && product.stock_quantity > 0
                    ? "Low Stock"
                    : undefined;

                return (
                  <ShopProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    imageUrl={imageUrl}
                    categoryLabel={product.category?.name || "Boutique Garment"}
                    description={product.description || `${product.name} • Handcrafted in Aba`}
                    ages="2Y - 12Y"
                    badge={badge}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Pagination bar ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 rounded-2xl">
          <div className="text-sm text-on-surface-variant">
            Showing{" "}
            <span className="font-bold text-on-surface">
              {filtered.length > 0 ? `1 - ${filtered.length}` : "0"}
            </span>{" "}
            of{" "}
            <span className="font-bold text-on-surface">{initialProducts.length}</span>{" "}
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

      {/* ── Lookbook Ribbon ── */}
      <section
        ref={lookbookRef}
        className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-12">
          {/* Tier 1: Editorial / Value Statement */}
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Tailored for Little Icons
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-on-surface font-semibold leading-tight">
              Kids Fashion for Brighter Tomorrows
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Every piece is designed with room to grow, soft breathable fibers
              for Nigeria&apos;s sunny climate, and durable construction that
              survives playground adventures without losing its runway charm.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <a
                className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-4 py-2.5 rounded-lg text-[13px] font-semibold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                href="https://wa.me/2347039315917?text=Hi%20Natasha,%20I%20would%20like%20to%20request%20a%20custom%20order%20for%20my%20kids!"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Request Custom Sizing</span>
                <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              </a>
              <span className="text-xs text-on-surface-variant">
                Bulk &amp; Birthday orders welcome
              </span>
            </div>
          </div>

          {/* Tier 2: Trust Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-outline-variant/30">
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
              <div key={title} className="flex items-start gap-3.5 p-3 sm:p-4 rounded-xl bg-surface-container/50 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-on-surface leading-snug">{title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
