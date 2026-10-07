import Image from "next/image";
import Link from "next/link";
import {
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
import { RevealText } from "@/components/ui/reveal-text";

// ── Stitch-generated placeholder imagery (temporary dev placeholders). ──
const HERO_IMAGE = "/images/about/about-hero.png";
const ATELIER_IMAGE = "/images/about/founders-note.png";
const FABRIC_IMAGE = "/images/about/step-1.png";
const STITCH_IMAGE = "/images/about/step-2.png";
const PACKAGE_IMAGE = "/images/about/step-3.png";
const PILLARS = [
  {
    icon: Shirt,
    title: "Cute • Comfy • Stylish",
    desc: "No stiff materials or scratchy tags. Only soft, breathable textiles that let little adventurers run, jump, and flourish completely unhindered.",
    tag: "Supreme Gentle Fit",
  },
  {
    icon: Cog,
    title: "Quality & Durability",
    desc: "Crafted with soft, durable fabrics and reinforced finishes designed to withstand active play and survive countless washes.",
    tag: "Premium Quality",
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
    desc: "Every order is carefully inspected for quality and durability before being wrapped and dispatched directly to your doorstep.",
    alt: "Neatly folded children's clothing parcels in branded packaging",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-surface">
      {/* ── Top Visual Story Intro ── */}
      <section className="relative w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start gap-3.5 sm:gap-4">
            <RevealText delay={0}>
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-primary" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Our Brand &amp; Purpose
                </span>
              </div>
            </RevealText>
            <RevealText delay={100}>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] text-on-surface font-semibold leading-tight">
                Little Styles,{" "}
                <span className="italic font-normal text-primary">
                  Big Confidence
                </span>
                .
              </h1>
            </RevealText>
            <RevealText delay={200}>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant max-w-xl">
                Founded by{" "}
                <strong className="font-semibold text-on-surface">
                  Natasha Ezinne Amuruonyenaego
                </strong>
                , Styled by Uriel is a premium children&apos;s fashion brand dedicated to creating
                stylish, comfortable, and quality outfits that combine modern fashion with durability.
              </p>
            </RevealText>
            <div className="flex flex-wrap items-center gap-4 pt-1 sm:pt-2">
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
            <div className="relative w-full max-w-md">
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-[0_20px_40px_-12px_rgba(113,82,60,0.14),0_6px_18px_-4px_rgba(113,82,60,0.08)] bg-surface-container">
                <Image
                  src={HERO_IMAGE}
                  alt="Cheerful African child wearing stylish comfortable kids fashion from Styled by Uriel"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                {/* Soft perimeter edge blending overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_18px_2px_rgba(255,241,235,0.45)] ring-1 ring-inset ring-primary/10 z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent z-[2]" />
                <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-4 rounded-lg shadow-md flex items-center justify-between z-[3]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      Styled by Uriel
                    </p>
                    <p className="text-lg font-bold text-on-surface">Little Styles, Big Confidence</p>
                  </div>
                  <BadgeCheck className="w-7 h-7 text-secondary" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-16 -top-24 w-96 h-96 rounded-full bg-secondary-container/25 blur-3xl pointer-events-none" />
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
                  alt="Styled by Uriel design workspace with warm camel fabrics and children's fashion moodboard"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="absolute -bottom-6 left-4 right-4 sm:right-auto sm:max-w-xs bg-surface-container-lowest p-4 rounded-xl shadow-lg">
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
            <div className="grid grid-cols-2 gap-4 mt-8 sm:mt-6">
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
            <RevealText delay={0}>
              <div className="flex items-center gap-2 text-primary">
                <span className="w-8 h-[2px] bg-primary" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  The Founder&apos;s Note
                </span>
              </div>
            </RevealText>
            <RevealText delay={100}>
              <h2 className="font-display text-3xl sm:text-4xl text-on-surface leading-tight">
                Designed for Modern Little Stars, Styled with Confidence
              </h2>
            </RevealText>
            <RevealText delay={200}>
              <div className="space-y-4 text-sm sm:text-base text-on-surface-variant leading-relaxed">
                <p>
                  <strong className="text-on-surface font-semibold">Styled by Uriel</strong>{" "}
                  is dedicated to creating stylish, comfortable, and quality outfits for kids.
                  We believe children deserve clothing that combines modern fashion with the
                  softness and ease they need to play, learn, and grow freely.
                </p>
                <p>
                  From everyday wear to special occasions, we offer carefully selected and beautifully
                  designed children&apos;s clothing built for both comfort and durability. Every piece is
                  created with care to ensure it feels gentle against young skin while enduring active play
                  and wash after wash.
                </p>
                <p>
                  Our goal is to make children&apos;s fashion more exciting, elegant, and accessible while
                  delivering excellent customer service. We help parents dress their little ones with
                  confidence, joy, and effortless style.
                </p>
              </div>
            </RevealText>
            {/* Founder signature */}
            <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container shadow-md">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo9qWn4kIoV0Mj9V9u0MMxFNSLvHdUvYeiaQv1vJxmVP26NaCFLVh3pOkWAfumDnCnqnRgLxku-EpKynHmAimpm_jzCjuibk0K51nWsV6I8d7dctDd1mRc7RPow9bdJ0BaAyMq6gQXWk-WLRtPyY5adZ1UuNzC9wx49ymWQ3CPX5iBVGMbuFj3CmyD7vhAabptfjBcH5RUujJt5c5nvYRTtsYCFMCziVIF7FOLknUZ-Wt8-kW1sdfxE-33Wx8FG6D3tg"
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
            <RevealText delay={0}>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Our Non-Negotiables
              </span>
            </RevealText>
            <RevealText delay={100}>
              <h2 className="font-display text-3xl sm:text-4xl text-on-surface">
                The Four Pillars of Styled by Uriel
              </h2>
            </RevealText>
            <RevealText delay={200}>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Built on a dedication to stylish design, gentle comfort, and lasting quality for your
                little ones.
              </p>
            </RevealText>
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
              <RevealText delay={0}>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Craftsmanship Unveiled
                </span>
              </RevealText>
              <RevealText delay={100}>
                <h2 className="font-display text-3xl sm:text-4xl text-on-surface mt-1">
                  Behind The Seams: Our Process
                </h2>
              </RevealText>
            </div>
            <RevealText delay={200}>
              <p className="text-sm sm:text-base text-on-surface-variant max-w-md leading-relaxed">
                How thoughtful design and quality fabrics come together into comfortable, stylish looks
                for your little ones.
              </p>
            </RevealText>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="flex flex-col bg-surface-container rounded-xl overflow-hidden shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg"
              >
                <div className="aspect-[4/3] w-full bg-surface-container-high overflow-hidden relative">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {step.step}
                      </span>
                      <CheckCircle className="w-5 h-5 text-primary" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-lg font-bold text-on-surface min-h-[3.5rem]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
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
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Have questions about child sizing, wholesale bundles, or customized styling
                packages? Natasha and the Styled by Uriel team are just a quick message away.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-start gap-3 p-3 bg-surface-container rounded-lg">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" strokeWidth={1.75} />
                  <div>
                    <strong className="text-sm text-on-surface block">Store &amp; Pickup Location</strong>
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
                      href="mailto:styledbyuriel1@gmail.com"
                      className="text-sm text-primary font-semibold hover:underline"
                    >
                      styledbyuriel1@gmail.com
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Nationwide Fulfillment
                  </span>
                  <h3 className="text-lg font-bold text-on-surface">Reliable Delivery &amp; Customer Care</h3>
                </div>
                <span className="bg-secondary-container text-secondary px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                  Fast Interstate Dispatch
                </span>
              </div>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                We&apos;re committed to making every order a smooth experience, from careful preparation
                and quality checks to reliable delivery and customer care.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-surface-container pt-4 text-xs sm:text-sm text-on-surface">
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
            <RevealText delay={0}>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Elevate Their Wardrobe
              </span>
            </RevealText>
            <RevealText delay={100}>
              <h2 className="font-display text-3xl text-on-surface">
                Ready to Dress Your Little Treasure?
              </h2>
            </RevealText>
            <RevealText delay={200}>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Discover our latest tracksuits, stylish polos, and durable outfits designed
                to make children&apos;s fashion exciting, elegant, and comfortable.
              </p>
            </RevealText>
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