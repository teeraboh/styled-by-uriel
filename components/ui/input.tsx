import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Stitch input: warm ivory fill, muted border, cocoa placeholder, soft radius
          "flex h-11 w-full rounded-md border border-outline-variant bg-brand-ivory px-4 py-2",
          "text-sm text-brand-dark-brown font-sans",
          "placeholder:text-on-surface-variant/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown focus-visible:border-brand-warm-brown",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
