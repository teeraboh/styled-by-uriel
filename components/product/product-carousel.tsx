"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductCarouselProps {
  children: React.ReactNode;
  /** Number of pagination dots to render */
  dotCount?: number;
  /** Index of the card that starts out "active" (featured treatment) */
  initialActiveIndex?: number;
}

/**
 * Horizontal, snap-scrolling product carousel with arrow controls and
 * pagination dots, matching the Stitch "Featured Products" layout.
 *
 * The carousel owns a single "active" card: arrow toggles (or clicking a dot)
 * move the active frame to the neighbouring card, which receives the
 * featured "stroke + shadow" treatment. Non-active cards keep their default
 * look. The track scrolls so the active card is centered.
 */
export function ProductCarousel({
  children,
  dotCount,
  initialActiveIndex = 0,
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const childrenArray = Children.toArray(children);
  const count = dotCount ?? childrenArray.length;
  const [activeIndex, setActiveIndex] = useState(() =>
    count > 0 ? Math.min(Math.max(initialActiveIndex, 0), count - 1) : 0
  );
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const track = trackRef.current;
    const card = track?.children[activeIndex] as HTMLElement | undefined;
    if (!card) return;

    card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex]);

  const goTo = (index: number) => {
    if (count === 0) return;
    setActiveIndex(Math.min(Math.max(index, 0), count - 1));
  };

  const prevDisabled = activeIndex === 0;
  const nextDisabled = activeIndex === count - 1;

  // Inject the "featured" (active) treatment into the card at activeIndex.
  const enhancedChildren = Children.map(children, (child, index) =>
    isValidElement<{ featured?: boolean }>(child)
      ? cloneElement(child, { featured: index === activeIndex })
      : child
  );

  const arrowClass = (disabled: boolean) =>
    cn(
      "absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-brand-beige/80 shadow-lg text-brand-dark-brown hover:text-brand-warm-brown flex items-center justify-center transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown",
      disabled
        ? "opacity-40 cursor-not-allowed hover:text-brand-dark-brown"
        : "hover:bg-white"
    );

  return (
    <div className="relative group/carousel px-2 sm:px-4" data-purpose="product-carousel">
      {/* Previous */}
      <button
        aria-label="Previous Products"
        onClick={() => goTo(activeIndex - 1)}
        disabled={prevDisabled}
        className={cn(arrowClass(prevDisabled), "left-0")}
        type="button"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Next */}
      <button
        aria-label="Next Products"
        onClick={() => goTo(activeIndex + 1)}
        disabled={nextDisabled}
        className={cn(arrowClass(nextDisabled), "right-0")}
        type="button"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex items-center gap-5 sm:gap-6 overflow-x-auto py-8 px-4 sm:px-8 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {enhancedChildren}
      </div>

      {/* Pagination dots — highlight + jump to the active card */}
      <div className="flex items-center justify-center gap-2 mt-4 select-none">
        {Array.from({ length: count }).map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              aria-label={`Go to product ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => goTo(index)}
              className={cn(
                "rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown",
                isActive
                  ? "w-2.5 h-2.5 bg-brand-warm-brown shadow-sm"
                  : "w-2 h-2 border border-brand-warm-brown/60 bg-transparent hover:bg-brand-beige"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}