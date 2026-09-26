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
 * - Transparent-cutout model photo layered bottom-right
 * - "SHOP NOW →" pill button CTA
 *
 * The desktop layered layout (text column left, image layered right, CTA on
 * the right) is maintained at every breakpoint — scaled down on mobile via
 * sm:/md: prefixes, with the image and button always visible.
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
        <div className="relative flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left p-6 sm:p-8 lg:p-10 select-none min-h-0 sm:min-h-[340px] overflow-hidden rounded-2xl bg-brand-sand shadow-sm">
          {/* Watermark Monogram */}
          <div className="absolute right-0 sm:-right-4 bottom-0 sm:-bottom-6 pointer-events-none opacity-20 text-brand-warm-brown select-none z-0">
            <span className="font-display font-black text-[100px] sm:text-[180px] md:text-[220px] leading-none tracking-tighter">
              SU
            </span>
          </div>

          {/* Left Content Column */}
          <div className="relative z-20 flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 lg:gap-8 w-full sm:max-w-[70%] lg:max-w-2xl">
            <div className="shrink-0 transform -rotate-2">
              <p className="font-script text-2xl sm:text-4xl lg:text-5xl text-brand-warm-brown font-bold leading-tight tracking-normal drop-shadow-xs">
                Cute
                <br />
                Comfy
                <br />
                Stylish ♡
              </p>
            </div>

            <div className="hidden md:block w-px h-24 bg-brand-beige" />

            <div className="flex flex-col justify-center pr-4">
              <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-on-surface leading-tight tracking-tight uppercase drop-shadow-xs">
                DRESS
                <br />
                THE NEXT
                <br />
                GENERATION
              </h3>

              <div className="flex items-center gap-2 mt-2 sm:mt-3">
                <span className="w-3 sm:w-5 h-px bg-primary/60" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  EXPLORE NEW ARRIVALS
                </span>
                <span className="w-3 sm:w-5 h-px bg-primary/60" />
              </div>
            </div>
          </div>

          {/* Model Image - full-width editorial card on mobile, layered right on sm+ */}
          <div className="w-full max-w-md mx-auto relative z-10 flex justify-center sm:absolute sm:right-24 sm:bottom-0 sm:z-10 sm:h-full sm:pt-4 sm:flex sm:items-end pointer-events-none select-none">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={400}
              height={500}
              className="block w-full h-auto sm:h-full sm:w-auto aspect-[4/5] sm:aspect-auto object-cover sm:object-contain object-center sm:object-bottom rounded-2xl sm:rounded-none shadow-xl sm:shadow-none filter contrast-[1.02]"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 300px, 400px"
            />
          </div>

          {/* Right Action CTA Button - centered below image on mobile */}
          <div className="relative z-20 shrink-0 w-full sm:w-auto flex items-center justify-center sm:justify-end sm:flex-col sm:items-end mt-6 sm:mt-0">
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg text-xs sm:text-[13px] font-bold uppercase tracking-wider bg-primary hover:bg-brand-warm-brown-dark text-on-primary shadow-md hover:shadow-xl transition-all duration-200 transform hover-lift"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}