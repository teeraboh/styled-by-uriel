import { Truck, ShieldCheck, Headphones, Package } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Across Nigeria",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% Safe & Reliable",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're Here for You",
  },
  {
    icon: Package,
    title: "Easy Returns",
    description: "Hassle-Free",
  },
] as const;

export function TrustStrip() {
  return (
    <section
      className="bg-brand-cream border-y border-brand-beige/50 py-10"
      data-purpose="trust-propositions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-surface-container border border-brand-beige/40 flex items-center justify-center text-primary shrink-0">
                <item.icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">
                  {item.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
