"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}

export function RevealText({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect to play once per visit
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Component
      ref={ref as any}
      style={{
        transitionProperty: "transform, opacity",
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? "auto" : "transform, opacity",
      }}
      className={`motion-reduce:!transition-none motion-reduce:!opacity-100 motion-reduce:!transform-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </Component>
  );
}
