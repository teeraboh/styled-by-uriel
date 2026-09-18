import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  MessageCircle,
  BadgeCheck,
  Heart,
  Shirt,
  Cog,
  Tag,
  Truck,
  Store,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Navigation,
} from "lucide-react";
import { StoreLocationMapLoader } from "@/components/location/store-location-map-loader";

// ── Stitch-generated placeholder imagery (temporary dev placeholders). ──
const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDtrq_IIFMVhOQJQJe0Ntrc7xQt9VedJqq319W6M1q8_lRniT8iJjV8fTmxcNaqI0iiaW2GkuSR77k2DXvLESLCsoGotya6KHnXzXAdLMYpiv-IFCo45t9TvcOblr-61pKoSPOlYScUBQu3deP1mbSq4w8ltz0jTyh14wMoR_kVh0vjEX-J0NJZqvzCVrzjLPOhb0Gq7bRlL-rOsk2dFw2IQtd5LQXFCbWbpVpcTufEGSr7wt0IbwhL";
const ATELIER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDU-BQxM5fo8duKeCk2qvFeoRjnshdgQ-HQzD3XaUP9dInFDGZVad63ZxEai2pxlKZqKbK_UBurKyYjEd7iP5YvmowCygIeVbLBY3zC6Kp6AquOWN_mdyR5hAqWGdsuIpQh3XzQJKI8sMaa8WS3KcPgxfwcQ9XcnsSj5oScrJVAJJeITAJhdOY80fsubdKDRY4EEubB_oKTXFvDgRDPuEbXLcAfhnM1ZVcnGv1oRSdDQC_T9vp53l6p";
const FABRIC_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA7r-DlXkNcqeOIMlWlVxMNx7-8D_Uw0kVu7FtHhS7VbLN20AQw6iqBvpN3wCn1QqQqOE3vqTna1Fgz5Q_QYdOiUZO4trCsS5_p8NkBPsaTIUE25BTmHq53MaSkOCFVC49RNFxfeqbdlsHXAoqnbndwn1bOJjauu4qsVa6JHLYueIObYeAyRhdNfH5-kGka9FGcTNLV_TyXCp3rYbwYb-u1yoxQA9xsbwADWvC5BaUUP95OQf4_Qekj";
const STITCH_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCce6QUBMUamkurygLYHGJdmUEoaLn_5sC1u_Bl3LwI7fyxyyPmVYCVw6AnPvPZe2yxJVTzjlOiFGzwQfIPdOpKiUEoSvtSyzZzMPXFTAM6aG1ZSiddrnARHJClxgFO95bj7vP8Op3u0AgY1lfQfSA_9qMEfBWOoCu4wsCdC1Q2Bl-3LdNztVi7-7dngP1att0LPTceet3U7Mrbpd8t6ESEZlCPi8MYIFPfFCRqxQdUdgRJlCGtzPqJ";
const PACKAGE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBuB5KPWEFscB-HOnEfMdD6iFjRvdtlEBcdR4GTvZEh7Vt0gRzfAuqAT7o3IkyY8nC2kdNHSWVr5Qve9W_38F7fYTBcZJdH9qS6-qet3yK_cfWzqGP3lSO88iWh_TwIN9C5yndvwhjiUdJeA5d_LRajAcwKiy3xXxqBi2HlS1nFRqVCpzxxnAdUanR4bHV6i__WkbJyCLLlCIp9nR4VbWnpoiUi2rl2OsziCjw7SJiFuA7asBTpar9O";
const PILLARS = [
  {
    icon: Shirt,
    title: "Cute • Comfy • Stylish",
    desc: "No stiff materials or scratchy tags. Only soft, breathable textiles that let little adventurers run, jump, and flourish completely unhindered.",
    tag: "Supreme Gentle Fit",
  },
  {
    icon: Cog,
    title: "Aba Craftsmanship",
    desc: "Harnessing the legendary garment artistry of Abia State to create contemporary, durable fashion pieces engineered to survive countless washes.",
    tag: "Enyimba Heritage",
  },
  {
    icon: Tag,
    title: "Accessible Luxury",
    desc: "High-end streetwear aesthetics and coordinated silhouettes at transparent, fair Nigerian Naira prices (₦15,000 to ₦25,000) for every family.",
    tag: "Honest Pricing",
  },
  {
    icon: Truck,
    title: "Nationwide Trust & Care",
    desc: "Direct communication via WhatsApp, prompt order fulfillment, and verified secure delivery to homes across all 36 Nigerian states.",
    tag: "Seamless Fulfillment",
  },
];

const PROCESS_STEPS = [
  {
    image: FABRIC_IMAGE,
    step: "Step 01",
    title: "Fabric Selection",
    desc: "We exclusively select 100% breathable organic cotton, gentle stretch knits, and premium fleeces that nurture sensitive skin without trapping heat.",
    alt: "Hands examining warm beige and cream organic cotton fabrics on an artisan cutting bench",
  },
  {
    image: STITCH_IMAGE,
    step: "Step 02",
    title: "Thoughtful Tailoring",
    desc: "Every garment features reinforced stitching, stretch-accommodating waistbands, and custom embroidered varsity patches built to outlast playground play.",
    alt: "Garment worker precision stitching a kid's tracksuit with custom varsity patches",
  },
  {
    image: PACKAGE_IMAGE,
    step: "Step 03",
    title: "Quality Control & Dispatch",
    desc: "Every order is hand-inspected for loose threads and seam strength before being wrapped and dispatched from Enyimba Market directly to your doorstep.",
    alt: "Neatly folded children's clothing parcels in branded packaging",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-surface">
      {/* ── Top Visual Story Intro ── */}
      <section className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            <div className="inline-flex items-center gap-2 bg-surface-container px-4 py-1.5 rounded-full">
              <ChevronLeft className="w-4 h-4 text-primary" strokeWidth={1.75} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Our Heritage &amp; Purpose
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[60px] lg:leading-[68px] text-on-surface tracking-tight">
              Little Styles, <br />
              <span className="italic font-normal text-primary text-[34px] sm:text-[44px] lg:text-[58px]">
                Big Stories
              </span>{" "}
              — Handcrafted in Aba.
            </h1>
            <p className="text-lg leading-relaxed text-on-surface-variant max-w-2xl">
              Founded by{" "}
              <strong className="font-semibold text-on-surface">
                Natasha Ezinne Amuruonyenaego
              </strong>
              , Styled by Uriel is redefining modern African children&apos;s fashion through
              playful luxury, supreme comfort, and durable craftsmanship.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-6 py-3 rounded-lg text-[13px] font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02]"
              >
                Explore The Collection
                <span aria-hidden>→</span>
              </Link>
              <a
                href="https://wa.me/2347039315917"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-surface-container text-on-surface hover:bg-surface-container-high px-5 py-3 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-primary" strokeWidth={1.75} />
                Chat With Natasha
              </a>
            </div>
          </div>

          {/* Mosaic collage visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-surface-container">
              <Image
                src={HERO_IMAGE}
                alt="Cheerful African boy in a tailored beige streetwear jacket at a warm cream studio, temporary dev placeholder"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-4 rounded-lg shadow-md flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Aba Atelier Hub
                  </p>
                  <p className="text-lg font-bold text-on-surface">Enyimba Garment Heart</p>
                </div>
                <BadgeCheck className="w-7 h-7 text-secondary" strokeWidth={1.5} />
              </div>
            </div>
            {/* Floating accent stamp */}
            <div className="absolute -top-4 -right-4 bg-secondary-container text-secondary p-4 rounded-xl shadow-lg hidden sm:flex flex-col items-center justify-center text-center rotate-3 w-28">
              <span className="font-display text-lg font-bold leading-none">100%</span>
              <span className="text-[9px] font-bold uppercase tracking-wider mt-1">
                Made in Nigeria
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder's Note ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Moodboard */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-4">
            <div className="relative">
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden shadow-md bg-surface-container-high">
                <Image
                  src={ATELIER_IMAGE}
                  alt="Fashion atelier worktable with warm camel cotton fabrics and tailoring tools, temporary dev placeholder"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="absolute -bottom-6 left-4 sm:left-4 bg-surface-container-lowest p-4 rounded-xl shadow-lg max-w-xs">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Heart className="w-5 h-5" strokeWidth={1.75} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    The Vision
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">
                  “Clothes soft enough for naptime, bold enough for the runway of
                  childhood adventures.”
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-surface-container p-4 rounded-lg flex flex-col items-start">
                <span className="text-[22px] font-extrabold text-primary">36</span>
                <span className="text-sm text-on-surface-variant font-medium">
                  States Delivered Nationwide
                </span>
              </div>
              <div className="bg-surface-container p-4 rounded-lg flex flex-col items-start">
                <span className="text-[22px] font-extrabold text-primary">₦15k+</span>
                <span className="text-sm text-on-surface-variant font-medium">
                  Affordable Luxury Value
                </span>
              </div>
            </div>
          </div>

          {/* Founder note content */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-5">
            <div className="flex items-center gap-2 text-primary">
              <span className="w-8 h-[2px] bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                The Founder&apos;s Note
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-on-surface leading-tight">
              Rooted in Aba Craft, Designed for Modern Little Stars
            </h2>
            <div className="space-y-4 text-base md:text-lg text-on-surface-variant leading-relaxed">
              <p>
                <strong className="text-on-surface font-semibold">Styled by Uriel</strong>{" "}
                started with a simple observation: children deserve clothes that feel as
                wonderfully comfortable as sleepwear while looking as elevated and trendy as
                high-end streetwear.
              </p>
              <p>
                From our creative hub at{" "}
                <strong className="text-on-surface font-semibold">
                  Enyimba Market, Aba, Abia State
                </strong>{" "}
                — renowned across West Africa for garment craft and vibrant commercial energy —
                we personally source premium breathable fabrics, oversee every stitch and seam,
                and design timeless pieces that withstand rough playground adventures and wash
                after wash.
              </p>
              <p>
                Every tracksuit, graphic polo, and tailored cargo jean is infused with care. We
                make dressing up effortless for Nigerian parents who want their young boys and
                girls to exude charm, gentleness, and effortless swagger.
              </p>
            </div>
            {/* Founder signature */}
            <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container shadow-md">
                  <Image
                    src="https://lh3.googleusercontent.com/aida/AEtjO1VvOVbJ0LKWMYvToScQK0ScciqRf7HTES0WlyEMOyFWfSKZ6NjdzgGYawwpX_eENzqka7Zej__h39fRB3pxoNFTy12mhgFfst5fzYFyfmDjoREAELSSQyf_PX6jjzy_lZq98-5z1g0f_Xcz908iYW0KmnAAMM-Jq2e-5D4U96FGs76XaB9e9V9QP0CCvYaTq8xH82A8bTDkv2ydZCQekzkSsK3sqjHdSS6leXySOXEe4sejroTuC67C0wzLmZG-MTOM7_lnuhzmBg"
                    alt="Natasha Ezinne, temporary dev placeholder"
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-on-surface">
                    Natasha Ezinne Amuruonyenaego
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Founder &amp; Creative Lead
                  </span>
                </div>
              </div>
              <div className="font-display italic text-lg text-primary flex items-center gap-2">
                <span>With love &amp; style, Natasha Ezinne</span>
                <Heart className="w-4 h-4 text-error" strokeWidth={2} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Brand Pillars ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Our Non-Negotiables
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-on-surface">
              The Four Pillars of Styled by Uriel
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Built on genuine tenderness for your children, authentic Nigerian craftsmanship,
              and world-class garment design.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-surface p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 group"
              >
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <pillar.icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-2">{pillar.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="text-primary text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                  <span aria-hidden className="w-4 h-px bg-primary" />
                  {pillar.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Behind The Seams: 3-Step Process ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Craftsmanship Unveiled
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-on-surface mt-1">
                Behind The Seams: Our Process
              </h2>
            </div>
            <p className="text-on-surface-variant max-w-md">
              How raw textiles in Aba transform into comfortable, statement looks for your
              little ones.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="flex flex-col bg-surface-container rounded-xl overflow-hidden shadow-sm"
              >
                <div className="h-48 w-full bg-surface-container-high overflow-hidden relative">
                  <Image
                    src={step.image}
                    alt={`${step.alt}, temporary dev placeholder`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      {step.step}
                    </span>
                    <CheckCircle className="w-5 h-5 text-primary" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">{step.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Boutique Headquarters ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Contact info card */}
          <div className="lg:col-span-6 bg-surface p-8 rounded-xl shadow-md flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-primary">
                <Store className="w-5 h-5" strokeWidth={1.75} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  Boutique Headquarters
                </span>
              </div>
              <h2 className="font-display text-3xl text-on-surface">
                Visit or Reach Natasha Directly
              </h2>
              <p className="text-on-surface-variant">
                Have questions about child sizing, wholesale bundles, or customized styling
                packages? Natasha and the Styled by Uriel team are just a quick message away.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-start gap-3 p-3 bg-surface-container rounded-lg">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" strokeWidth={1.75} />
                  <div>
                    <strong className="text-sm text-on-surface block">Atelier Location</strong>
                    <span className="text-sm text-on-surface-variant">
                      Enyimba Market, Aba, Abia State, Nigeria
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-surface-container rounded-lg">
                  <Phone className="w-5 h-5 text-primary mt-0.5" strokeWidth={1.75} />
                  <div>
                    <strong className="text-sm text-on-surface block">
                      Direct WhatsApp &amp; Calls
                    </strong>
                    <a
                      href="tel:07039315917"
                      className="text-sm text-primary font-semibold hover:underline"
                    >
                      07039315917
                    </a>
                    <span className="text-xs text-on-surface-variant block">
                      (Instant order inquiries &amp; sizing assistance)
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-surface-container rounded-lg">
                  <Mail className="w-5 h-5 text-primary mt-0.5" strokeWidth={1.75} />
                  <div>
                    <strong className="text-sm text-on-surface block">Official Inquiries</strong>
                    <a
                      href="mailto:natashaejike99@gmail.com"
                      className="text-sm text-primary font-semibold hover:underline"
                    >
                      natashaejike99@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <a
                href="https://wa.me/2347039315917"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary py-3 px-4 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
                Open WhatsApp Conversation
              </a>
            </div>
          </div>

          {/* Commercial center / regional hub */}
          <div className="lg:col-span-6 flex flex-col bg-surface rounded-xl overflow-hidden shadow-md">
            <div className="relative w-full h-80 bg-surface-container-high isolate">
              <StoreLocationMapLoader />
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=5.1079,7.3472"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-surface/95 text-primary text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-md shadow-sm hover:bg-surface-container transition-colors border border-outline-variant"
              >
                <Navigation className="w-3.5 h-3.5" />
                Get Directions
              </a>
            </div>
            <div className="p-6 bg-surface flex flex-col justify-between flex-1 gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Commercial Center
                  </span>
                  <h3 className="text-lg font-bold text-on-surface">Aba Garment Ecosystem</h3>
                </div>
                <span className="bg-secondary-container text-secondary px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                  Fast Interstate Dispatch
                </span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Strategically centered in Aba to tap into authentic textile artisans, top-tier
                seamstresses, and seamless logistics routes connecting our studio directly to
                Lagos, Abuja, Port Harcourt, Enugu, and all Nigerian state capitals.
              </p>
              <div className="flex items-center justify-between pt-1 text-sm text-on-surface border-t border-surface-container pt-4">
                <span className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                  Open Mon – Sat: 8:00 AM – 6:00 PM WAT
                </span>
                <span className="text-primary font-semibold text-xs sm:text-sm">
                  Fast Nationwide Courier
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community / CTA Banner ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface">
        <div className="max-w-7xl mx-auto rounded-xl bg-surface-container-high p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-2 z-10 max-w-xl text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Elevate Their Wardrobe
            </span>
            <h2 className="font-display text-3xl text-on-surface">
              Ready to Dress Your Little Treasure?
            </h2>
            <p className="text-on-surface-variant">
              Discover our latest tracksuits, varsity-inspired polos, and durable denim
              trousers crafted right here in Aba.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 z-10">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-6 py-3 rounded-lg text-[13px] font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02]"
            >
              Shop The Collection
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-surface text-on-surface hover:bg-surface-container px-5 py-3 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Contact Customer Care
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}