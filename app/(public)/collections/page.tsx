import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Ruler,
  Package,
  ArrowRight,
  CheckCircle,
  Shield,
  Sun,
  Truck,
  BadgeCheck,
  MessageCircle,
  Camera,
} from "lucide-react";

// ── Temporary placeholder imagery — Stitch-generated dev placeholders, to be
// replaced with real brand/UGC photography (PRD §15: never invent product data).
const FEATURED_DROP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAs15bFkRLo-z6B87zVS0Z53EqtBR0y5EqJ_z3cEc8N75WyWaFFo6R_djsf66qm0tkJsJNNsKSRT_wIUGrM1dodiIHTeJMHauUnyHLnhZN3-gWam3-_kYZhfHdHPsI-eYxcryRFCZO__iOtFHl7c8SZKYrBBgcqfjduGnp5OXAbYcyNo9nCovrvY90Z2IH8Z9JhBVIN5YQljxdCINbre4kZv-FT3RRUGXBEbW6AftlNi6m5QTFrvtVT";

const COLLECTIONS = [
  {
    slug: "everyday-essentials",
    title: "Playground & Everyday Essentials",
    fromPrice: 12000,
    edition: "Essential 01",
    description:
      "Breathable, ultra-soft combed cotton pieces built to survive tumbling, running, and all-day adventures while staying effortlessly crisp.",
    feature: { icon: CheckCircle, label: "Machine Washable" },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-6zhL61Fow1fwb1b5R0PF7lL3M5wQCaoABZLd45LFLWXkrz67wPwG_H1sW8AY8jDEWBexZ2nhRODd0WrWwMoLlKKrTpYYqzY8DtUcxk1lNXe4kcNALmm8dQIlq5yZjTzit77Lq7aniDsycjaFtsRTS4dUUripMWqlFThQHrMkJ9QsamIDqQZc8VepOPR39KQrjS4Neuy-iSsPVzkOKilXeiKHhQGHcgnYdcDhZmaDucyqFo_IYWUC",
  },
  {
    slug: "streetwear-tracksuits",
    title: "Signature Streetwear & Tracksuits",
    fromPrice: 25000,
    edition: "Edition 02",
    description:
      "Our iconic tan & cream coordinated sets featuring tactile chenille patches, cozy brushed interior linings, and tailored streetwear attitude.",
    feature: { icon: Shield, label: "Brushed Interior Lining" },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsTb3MdGjI1OSL0JqUsTsfiqh55efQtxOdQigMu0ZnbwSUKMY_ADot0iynTaOXzguN_9XcdE2XykKyve-PpS66mtlv4wy53E9AVSLDtwbH7_4tIDzMpjZ51f-fLtcHwYeHpeGugv9Cchg05aWALjW5UyGWd4_JAN2xDPNhV00obMHC1yQgn2sArDoDvYbKEYAM9_pOcT7ZhSnEW0jQcPswf_WatRX8rS3riYbZNK8cociudFwgOoPL",
  },
  {
    slug: "utility-denim-cargo",
    title: "Utility Denim & Cargo Series",
    fromPrice: 17000,
    edition: "Utility 03",
    description:
      "Reinforced tactical pockets, flexible elastane-cotton blend, and durable triple stitching made for active explorers who like a modern silhouette.",
    feature: { icon: Shield, label: "Extra Durable Twill" },
    imageUrl:
      "https://lh3.googleusercontent.com/aida/AEtjO1VZFGAF20LCOV1QXdhtNxhydXUSDcVQbN3g_RGl_JLEtVj2F-7RbNQ2aJgOPQtKDi87ii4J1r4VFM9q31P20XeLSrAIxrfTtvrJV6uks_Ck36Ah4RC39jBV8zL2OdURjaMM11AE26HyeSZM1qJBkMpFnjsLQ_9grVzifAyt6-BwjQOz7IP7SlWRV_a_B--rmzv3J0O62UG0wkHdYd6xxKuoVDQFeisgKy6yiGtcaZpq4QbDeLUqMI8miL0",
  },
  {
    slug: "sun-neutral-sets",
    title: "Sun & Neutral Sets (Harmattan/Sun)",
    fromPrice: 20000,
    edition: "Resort 04",
    description:
      "Earth-toned coords and versatile separates that mix and match effortlessly for breezy tropical daytime styling and cozy evening layers.",
    feature: { icon: Sun, label: "Breathable Lightweight" },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAB6DyeIwbcZRolzieZInYxMOfqkf6XICCQGeTEK_Lh8kUk8EOKdb-JZTyr4Z5C4sDLvEt-AAQ-NIAgGgDzEx7QDn3dhWnRkD3oZY5CUexLvGmpNMkVgynTgews4EFmFAccqjMyNWfSB3dAgDXRtSbDu_lPVoYCOTkXcJLyucnEL3lwAvqELdvPzvVZczZOmjcsLL8p1IlIaGi4eROyqLUsA9GD9KyGhoT_xyhh-Yvb_5mC1RnSss_k",
  },
];

const LOOKBOOK_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS3rERXz14cG9vFrDlO5_0fhRKKmFd7Lobjb7ovdtxP_GUsVFjyRbJ0UxOyk5-Ge-0eNu_7V9_L59XV8Ig07PdiRsPjp2I8aWuLHWT8oCaRNPBqA8kF7XSXF2a-v9_e8wXH-WrRTkpFsInAkssdL58UrsluDpC37lbooyrK0NXf8V4EDy3kxm85IcTsZMf7J0Xl79OyMMb7R3y5o0p5fl_CzHlSpArnXfFRLgyLpO7A2ijBvbkvnwI",
    alt: "Young boy wearing a Styled by Uriel streetwear tracksuit",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYwz__GDTAdS64QcyGC5KKg6tzNsmkXGfuzSZXepBz6e8w-V1mt6KKVcSNZdv1KEzRGu7sfxHqDOr9BKQsRiLBNt1McdRSUBdCHf0Ot2D2SpJoxAK6CPvy9mWB6gWPr5jE6nuGMWZW2DVmiGX_h4ejyZ9nrrD5CoSki0SxT7dI-dylcpWdqu2FUGBTrUFEveNQwbqwHLkxFoul0Ww4hNGOBsR5t7gFLc6FMOvYKEhE7W50gAfjRjJ4",
    alt: "Matching custom tees and cargo trousers",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7XWhGZ2C6n4EXZSmrrihK7Z6dhU8ssPoaKsGwgq5C2-kNXa-BXlKCvLj1xsOduVBk9dDU-FxBxhqj6Iimn80b5HX1KRsjwTAO7RlP99faokcw7JMNNkoPctH7TYKRPNVwq6oqUjl9X310BcFpf0_uWIblzB7FFOJIN6yGtgbsAbpTQg-Z2Tz5-lSxTmGwXOWO13PZGCZ3UI8NxIWu9ruOoxZCtkdeHzVZzIsn9bkvwkd9vjjjgTMF",
    alt: "Toddler in neutral beige cargo shorts",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBy3N6-5_R16Msl58S_UY4M6rcFRBY1faIIc4huDSG42ANsyKkcUio-dt3tUo-wTIDGhXFnR9bI1AKyF_eS0VjmKzOnKwlz0nlIx6VFCAKqoQdLzM9C12a47IPJnL6RLLwn8ChRtfBrrn8wr_40pMXn709K6liSbUpl1Hasf25gaVId1eV7gbqDqrpkH-oHOTq1byYwJXOi30W8W4rnawlbNMDnp3Bn3xmb2ns1Yl__mNvqpNE-NYhP",
    alt: "Kid in charcoal cargo pants at a family gathering",
  },
];

export default function CollectionsPage() {
  return (
    <main className="bg-surface">
      {/* ── Editorial title ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 sm:py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-px bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Editions &amp; Wardrobes
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] text-on-surface tracking-tight font-semibold leading-tight">
              Curated Collections
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2 max-w-xl leading-relaxed">
              Thoughtfully designed wardrobes for every occasion, from
              playground adventures to celebration streetwear. Tailored for
              comfort, made to inspire confidence.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap items-center gap-2 bg-surface-container-low p-1.5 rounded-full self-start md:self-auto">
            <span className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-[13px] font-semibold transition-all shadow-sm">
              All Capsules
            </span>
            <span className="px-4 py-1.5 rounded-full text-on-surface-variant text-[13px] font-semibold">
              Streetwear
            </span>
            <span className="px-4 py-1.5 rounded-full text-on-surface-variant text-[13px] font-semibold">
              Everyday
            </span>
            <span className="px-4 py-1.5 rounded-full text-on-surface-variant text-[13px] font-semibold">
              Utility
            </span>
          </div>
        </div>
      </section>

      {/* ── Featured hero drop ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-10 sm:pb-14">
        <div className="relative bg-surface-container rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-6 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-primary mb-2">
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-secondary text-[11px] font-bold uppercase tracking-widest">
                  New Arrival
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  • Aba Atelier Drop
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-on-surface mb-2 leading-tight font-semibold">
                The Signature Streetwear Drop 2026
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant mb-6 max-w-lg leading-relaxed">
                High-grade cotton, statement patches, and relaxed silhouettes
                made for effortless confidence. Created to let little ones move
                with pride and style.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
                <div className="flex items-center gap-2 text-on-surface">
                  <Ruler className="text-primary w-5 h-5" strokeWidth={1.75} />
                  <span className="text-sm font-semibold">Sizes 2Y – 12Y</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-outline-variant hidden sm:block" />
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Package
                    className="text-secondary w-5 h-5"
                    strokeWidth={1.75}
                  />
                  <span className="text-sm">Made in Nigeria</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/shop/streetwear-tracksuits"
                  className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-5 py-2.5 rounded-lg text-[13px] font-semibold uppercase tracking-wider shadow-sm transition-colors"
                >
                  Explore The Drop
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
                <span className="text-[22px] font-extrabold text-on-surface">
                  From ₦25,000
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 relative h-[380px] lg:h-[480px] bg-surface-container-high overflow-hidden flex items-center justify-center p-4">
              <Image
                src={FEATURED_DROP_IMAGE}
                alt="Warm studio photo of children wearing Styled by Uriel streetwear tracksuits"
                fill
                className="object-cover rounded-lg shadow-sm"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-6 right-6 bg-surface/90 backdrop-blur-md px-4 py-1 rounded-full shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface">
                  Aba Ready-to-Wear
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Collection grid ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-[11px] font-bold uppercase text-primary tracking-[0.2em] mb-2">
            Seasonal Capsules
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-on-surface font-semibold">
            Explore Curated Ensembles
          </h2>
          <div className="w-12 h-0.5 bg-secondary-container mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {COLLECTIONS.map((collection) => (
            <article
              key={collection.slug}
              className="group flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative w-full h-80 sm:h-96 bg-surface-container-high overflow-hidden">
                <Image
                  src={collection.imageUrl}
                  alt={collection.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-4 py-1 rounded-full">
                  <span className="text-[11px] font-bold uppercase text-primary tracking-widest">
                    {collection.edition}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between gap-4 bg-surface-container-low">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                      {collection.title}
                    </h3>
                    <span className="text-[22px] font-extrabold text-primary">
                      From ₦{collection.fromPrice.toLocaleString("en-NG")}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {collection.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-on-surface-variant flex items-center gap-2">
                    <collection.feature.icon
                      className="w-4 h-4 text-primary"
                      strokeWidth={1.75}
                    />
                    {collection.feature.label}
                  </span>
                  <Link
                    href={`/shop/${collection.slug}`}
                    className="inline-flex items-center gap-2 text-primary text-base font-semibold hover:translate-x-1 transition-transform"
                  >
                    View Collection
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Editorial value strip ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 sm:py-14">
        <div className="bg-surface-container-high rounded-xl p-6 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Nationwide Express",
                text: "Direct dispatch from Aba to Lagos, Abuja & nationwide.",
              },
              {
                icon: BadgeCheck,
                title: "Skin-Friendly Cottons",
                text: "Pre-washed and gentle on delicate skin.",
              },
              {
                icon: Ruler,
                title: "Custom Tailored Fit",
                text: "Natasha crafts to size on request.",
              },
              {
                icon: MessageCircle,
                title: "Instant WhatsApp Order",
                text: "Send a screenshot of any look to verify stock and sizes.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-on-surface mb-0.5">
                    {title}
                  </h4>
                  <p className="text-xs text-on-surface-variant">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community lookbook ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 sm:py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase text-primary tracking-[0.2em] block mb-2">
              Community Lookbook
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-on-surface font-semibold">
              Styled by Uriel In Real Life
            </h2>
          </div>
          <a
            className="inline-flex items-center gap-2 text-primary text-base font-semibold hover:underline"
            href="https://instagram.com/official_styledbyuriel"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Camera className="w-5 h-5" strokeWidth={1.75} />
            @official_styledbyuriel
          </a>
        </div>

        {/* Placeholder UGC grid — replace with real customer photos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LOOKBOOK_IMAGES.map((image) => (
            <a
              key={image.src}
              href="https://instagram.com/official_styledbyuriel"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden rounded-lg aspect-square bg-surface-container-high"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </a>
          ))}
        </div>
      </section>

      {/* ── WhatsApp VIP service card ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-14">
        <div className="bg-surface-container rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-8 h-8" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface mb-1">
                Need Custom Sizing or Urgent City Delivery?
              </h3>
              <p className="text-sm text-on-surface-variant max-w-xl">
                Looking for a custom size or immediate delivery in Aba, Port
                Harcourt, Enugu, or Lagos? Chat with Natasha directly on
                WhatsApp for concierge ordering and real-time photos.
              </p>
            </div>
          </div>
          <a
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-transform hover:scale-105 shadow-sm whitespace-nowrap"
            href="https://wa.me/2347039315917"
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
