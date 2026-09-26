"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
 * Endless Editorial Focus Carousel
 *
 * Combines the horizontal snap-scrolling architecture with an endless slideshow interaction:
 * - Seamless infinite looping with modular distance calculation: 1 → 2 → 3 → 4 → 5 → 6 → 1...
 * - Card visual state is bound to logical distance, eliminating flash/snap during buffer resets
 * - Active center card: Visually dominant hero (1.08x scale, -8px lift, 1.0 opacity, deep shadow)
 * - Flanking neighbor cards: Subdued background cards (0.92x scale, 0.30 opacity)
 * - Distant cards: Faded into background (0.88x scale, 0.10 opacity)
 * - 3.5s autoplay hold with 500ms smooth cubic-bezier(0.16, 1, 0.3, 1) transition
 */
export function ProductCarousel({
  children,
  dotCount,
  initialActiveIndex = 0,
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const childrenArray = Children.toArray(children);
  const count = dotCount ?? childrenArray.length;

  // 3-set virtual buffer: [Set 0 (0..N-1), Set 1 (N..2N-1), Set 2 (2N..3N-1)]
  const isInfinite = count > 1;
  const initialLogical = count > 0 ? (initialActiveIndex % count + count) % count : 0;
  const initialVirtual = isInfinite ? count + initialLogical : 0;

  const [activeLogicalIndex, setActiveLogicalIndex] = useState(initialLogical);
  const virtualIndexRef = useRef(initialVirtual);
  const isAnimatingRef = useRef(false);
  const isUserInteractingRef = useRef(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasCenteredInitialRef = useRef(false);

  // Position track to middle set on initial mount
  useEffect(() => {
    if (!isInfinite || hasCenteredInitialRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const initialCard = track.children[initialVirtual] as HTMLElement | undefined;
    if (initialCard) {
      const targetLeft =
        initialCard.offsetLeft - (track.clientWidth - initialCard.clientWidth) / 2;
      track.scrollLeft = targetLeft;
      hasCenteredInitialRef.current = true;
    }
  }, [initialVirtual, isInfinite]);

  // Real-time synchronization during manual swipe/touch ONLY (disabled during programmatic transitions)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId: number | null = null;

    const handleScroll = () => {
      // Ignore scroll events during programmatic transitions or when not user interacting
      if (isAnimatingRef.current) return;
      if (!isUserInteractingRef.current) return;

      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let closestVirtual = 0;
        let closestDist = Infinity;

        Array.from(track.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const childCenter = el.offsetLeft + el.clientWidth / 2;
          const dist = Math.abs(trackCenter - childCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closestVirtual = i;
          }
        });

        virtualIndexRef.current = closestVirtual;
        const logical = count > 0 ? (closestVirtual % count + count) % count : 0;
        setActiveLogicalIndex(logical);
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [count]);

  // Programmatic slide transition with lock and seamless buffer normalization
  const goToVirtual = useCallback(
    (targetVirtual: number) => {
      if (count === 0) return;
      const track = trackRef.current;
      if (!track) return;

      if (!isInfinite) {
        const clamped = Math.min(Math.max(targetVirtual, 0), count - 1);
        virtualIndexRef.current = clamped;
        setActiveLogicalIndex(clamped);
        const card = track.children[clamped] as HTMLElement | undefined;
        if (card) {
          const targetLeft =
            card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
          track.scrollTo({ left: targetLeft, behavior: "smooth" });
        }
        return;
      }

      // Compute target logical index and lock scroll listener
      const targetLogical = ((targetVirtual % count) + count) % count;
      isAnimatingRef.current = true;
      virtualIndexRef.current = targetVirtual;
      setActiveLogicalIndex(targetLogical);

      const card = track.children[targetVirtual] as HTMLElement | undefined;
      if (card) {
        const targetLeft =
          card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
        track.scrollTo({ left: targetLeft, behavior: "smooth" });
      }

      // Settle animation and silently normalize buffer position if outside middle set
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        if (!trackRef.current) return;
        const currentVirtual = virtualIndexRef.current;

        // If navigated into Set 0 or Set 2, silently jump to middle set (Set 1)
        if (currentVirtual < count || currentVirtual >= 2 * count) {
          const normalizedVirtual = count + targetLogical;
          const normCard = trackRef.current.children[
            normalizedVirtual
          ] as HTMLElement | undefined;
          if (normCard) {
            const normLeft =
              normCard.offsetLeft -
              (trackRef.current.clientWidth - normCard.clientWidth) / 2;
            trackRef.current.style.scrollBehavior = "auto";
            trackRef.current.scrollLeft = normLeft;
            trackRef.current.style.scrollBehavior = "";
            virtualIndexRef.current = normalizedVirtual;
          }
        }

        isAnimatingRef.current = false;
      }, 510);
    },
    [count, isInfinite]
  );

  // Exact step functions
  const nextSlide = useCallback(() => {
    goToVirtual(virtualIndexRef.current + 1);
  }, [goToVirtual]);

  const prevSlide = useCallback(() => {
    goToVirtual(virtualIndexRef.current - 1);
  }, [goToVirtual]);

  const goToLogical = useCallback(
    (targetLogicalIndex: number) => {
      const currentVirtual = virtualIndexRef.current;
      const currentLogical = ((currentVirtual % count) + count) % count;
      const diff = targetLogicalIndex - currentLogical;
      goToVirtual(currentVirtual + diff);
    },
    [count, goToVirtual]
  );

  // Autoplay loop (3.5s interval)
  useEffect(() => {
    if (!isInfinite || count <= 1) return;

    // Respect prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const startAutoplay = () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = setInterval(() => {
        if (isUserInteractingRef.current || isAnimatingRef.current) return;
        nextSlide();
      }, 3500);
    };

    startAutoplay();

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (userInteractionTimeoutRef.current)
        clearTimeout(userInteractionTimeoutRef.current);
    };
  }, [count, isInfinite, nextSlide]);

  const handleUserInteractionStart = () => {
    isUserInteractingRef.current = true;
    if (userInteractionTimeoutRef.current)
      clearTimeout(userInteractionTimeoutRef.current);
  };

  const handleUserInteractionEnd = () => {
    if (userInteractionTimeoutRef.current)
      clearTimeout(userInteractionTimeoutRef.current);
    userInteractionTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 2500);
  };

  // Build virtual cards list
  const virtualChildren = isInfinite
    ? [
        ...childrenArray.map((c, i) => ({ child: c, originalIndex: i, vIndex: i })),
        ...childrenArray.map((c, i) => ({
          child: c,
          originalIndex: i,
          vIndex: count + i,
        })),
        ...childrenArray.map((c, i) => ({
          child: c,
          originalIndex: i,
          vIndex: 2 * count + i,
        })),
      ]
    : childrenArray.map((c, i) => ({ child: c, originalIndex: i, vIndex: i }));

  const enhancedVirtualChildren = virtualChildren.map(({ child, originalIndex, vIndex }) => {
    // Compute distance relative to activeLogicalIndex in modular ring space
    const rawDiff = Math.abs(originalIndex - activeLogicalIndex);
    const distance = Math.min(rawDiff, count - rawDiff);
    const isHero = distance === 0;

    return isValidElement<{
      featured?: boolean;
      distance?: number;
      onCardClick?: () => void;
      key?: string | number;
    }>(child)
      ? cloneElement(child, {
          key: `v-card-${vIndex}`,
          featured: isHero,
          distance,
          onCardClick: distance !== 0 ? () => goToVirtual(vIndex) : undefined,
        })
      : child;
  });

  const arrowClass = cn(
    "absolute top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-brand-beige/80 shadow-lg text-brand-dark-brown hover:text-brand-warm-brown flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown cursor-pointer hover:bg-white hover:scale-105 active:scale-95 hover:shadow-xl"
  );

  return (
    <div
      className="relative group/carousel px-1 sm:px-4"
      data-purpose="product-carousel"
      onMouseEnter={handleUserInteractionStart}
      onMouseLeave={handleUserInteractionEnd}
      onTouchStart={handleUserInteractionStart}
      onTouchEnd={handleUserInteractionEnd}
    >
      {/* Previous Button */}
      <button
        aria-label="Previous Product"
        onClick={() => {
          handleUserInteractionStart();
          prevSlide();
          handleUserInteractionEnd();
        }}
        className={cn(arrowClass, "left-0 sm:left-1")}
        type="button"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} />
      </button>

      {/* Next Button */}
      <button
        aria-label="Next Product"
        onClick={() => {
          handleUserInteractionStart();
          nextSlide();
          handleUserInteractionEnd();
        }}
        className={cn(arrowClass, "right-0 sm:right-1")}
        type="button"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} />
      </button>

      {/* Scrollable Focus Track */}
      <div
        ref={trackRef}
        className="flex items-center gap-5 sm:gap-6 overflow-x-auto py-10 sm:py-12 px-4 sm:px-8 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {enhancedVirtualChildren}
      </div>

      {/* Pagination Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-2 select-none">
        {Array.from({ length: count }).map((_, index) => {
          const isActive = index === activeLogicalIndex;
          return (
            <button
              key={index}
              type="button"
              aria-label={`Go to product ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => {
                handleUserInteractionStart();
                goToLogical(index);
                handleUserInteractionEnd();
              }}
              className={cn(
                "rounded-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown cursor-pointer",
                isActive
                  ? "w-6 h-2 bg-brand-warm-brown shadow-xs"
                  : "w-2 h-2 border border-brand-warm-brown/60 bg-transparent hover:bg-brand-beige"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}