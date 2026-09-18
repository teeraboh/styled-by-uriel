import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-warm-brown text-white",
        secondary: "bg-brand-almond text-brand-dark-brown",
        outline: "border border-outline-variant text-on-surface-variant",
        destructive: "bg-error text-on-error",
        success: "bg-green-700 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
