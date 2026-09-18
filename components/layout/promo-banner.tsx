import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface PromoBannerProps {
  /** Optional custom model image URL */
  imageUrl?: string;
  /** Optional custom image alt text */
  imageAlt?: string;
  /** CTA link target */
  href?: string;
}

/**
 * Editorial Feature Promotional Banner matching the canonical Stitch design.
 * Features:
 * - Script kicker ("Cute Comfy Stylish ♡")
 * - High-impact display headline ("DRESS THE NEXT GENERATION")
 * - Background "SU" monogram watermark
 * - Transparent-cutout model photo layered in the center/right
 * - "SHOP NOW →" pill button CTA
 */
export function PromoBanner({
  imageUrl = "https://lh3.googleusercontent.com/aida/AEtjO1VwpoTVa0fyucjCWq-98pOhNIGGjNZQgS_umFMWJILwN_oBOf1OCWDKM3pK1tZ9Mnk-B_yESV_6U7IMdtxABr8JTkfJPaDE6PxOKqTlzWKxT-dWAwG_bDY0FKT-ycGss1xWu0aJzhX5uhKb4d_zyveAyUJ7MFiQkL8Xe2vwfj_vb2ehJ0nhAy6jckQtz-UiAxztGAYJfydNvXTdrzQFWlNq1Q1nDyU59U_zslTzI-XCCmNfg0uaBSfZJkw",
  imageAlt = "Dress The Next Generation - Styled by Uriel",
  href = "/shop",
}: PromoBannerProps) {
  return (
    <section
      className="border-y border-brand-beige/80 relative bg-transparent"
      data-purpose="secondary-promotional-banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="relative rounded-2xl flex items-center justify-between p-6 sm:p-8 lg:p-10 select-none min-h-[340px] overflow-hidden bg-brand-sand shadow-sm">
          {/* Watermark Monogram */}
          <div className="absolute -right-4 -bottom-6 pointer-events-none opacity-20 text-brand-warm-brown select-none z-0">
            <span className="font-display font-black text-[120px] sm:text-[180px] md:text-[220px] leading-none tracking-tighter">
              SU
            </span>
          </div>

          {/* Left Content Column */}
          <div className="relative z-20 flex flex-col md:flex-row md:items-center gap-6 lg:gap-8 max-w-2xl">
            <div className="shrink-0 transform -rotate-2">
              <p className="font-script text-3xl sm:text-4xl lg:text-5xl text-brand-warm-brown font-bold leading-tight tracking-normal drop-shadow-xs">
                Cute
                <br />
                Comfy
                <br />
                Stylish ♡
              </p>
            </div>

            <div className="hidden md:block w-px h-24 bg-brand-beige" />

            <div className="flex flex-col justify-center pr-4">
              <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-brand-dark-brown leading-tight tracking-tight uppercase drop-shadow-xs">
                DRESS
                <br />
                THE NEXT
                <br />
                GENERATION
              </h3>

              <div className="flex items-center gap-2 mt-3">
                <span className="w-5 h-px bg-brand-warm-brown/60" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-brand-warm-brown">
                  EXPLORE NEW ARRIVALS
                </span>
                <span className="w-5 h-px bg-brand-warm-brown/60" />
              </div>
            </div>
          </div>

          {/* Centered/Right Layered Model Image */}
          <div className="absolute right-24 sm:right-36 md:right-44 lg:right-48 bottom-0 z-10 hidden sm:flex items-end pointer-events-none select-none h-full pt-4">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={400}
              height={500}
              className="h-full w-auto object-contain object-bottom filter contrast-[1.02]"
              sizes="(max-width: 1024px) 300px, 400px"
            />
          </div>

          {/* Right Action CTA Button */}
          <div className="relative z-20 shrink-0 self-center hidden sm:flex flex-col items-end">
            <Link
              href={href}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-brand-warm-brown hover:bg-brand-warm-brown-dark text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover-lift"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Clickable Overlay */}
          <Link
            href={href}
            className="sm:hidden absolute inset-0 z-30"
            aria-label="Shop New Arrivals"
          />
        </div>
      </div>
    </section>
  );
}
