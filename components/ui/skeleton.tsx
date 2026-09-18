import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-brand-sand/60",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
