import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles matching Stitch design: uppercase, letter-spacing, min tap target
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-brown focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary CTA: rich cocoa brown bg, white text (from Stitch)
        default:
          "bg-brand-warm-brown text-white hover:bg-brand-warm-brown-dark shadow-sm",
        // Secondary: caramel beige bg, dark text (from Stitch design system)
        secondary:
          "bg-brand-caramel text-brand-dark-brown hover:bg-brand-caramel/90",
        // Ghost / Outlined: transparent with border
        outline:
          "border border-brand-warm-brown text-brand-warm-brown bg-transparent hover:bg-brand-warm-brown hover:text-white",
        // Subtle ghost variant
        ghost:
          "text-brand-warm-brown hover:bg-brand-sand/50",
        // Destructive for delete actions
        destructive:
          "bg-error text-on-error hover:bg-error/90",
        // Link style
        link:
          "text-brand-warm-brown underline-offset-4 hover:underline normal-case tracking-normal",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-xs rounded-md",
        sm: "h-9 px-4 text-[11px] rounded",
        lg: "h-12 px-8 text-sm rounded-md",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
