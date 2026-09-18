"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCartStore } from "@/store/cart";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validation/checkout";

const DEFAULT_VALUES: CheckoutFormValues = {
  email: "",
  phone: "",
  whatsappUpdates: false,
  firstName: "",
  lastName: "",
  streetAddress: "",
  landmark: "",
  state: "",
  city: "",
  shippingMethod: "standard",
  orderNotes: "",
  termsAgreed: false,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems } = useCartStore();

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const subtotal = getTotalPrice();
  const totalItems = getTotalItems();

  const onSubmit = () => {
    // TODO: POST to /api/orders (creates a pending order) then
    // /api/payments/initiate to start Flutterwave. Frontend placeholder
    // until the backend lands — do not treat this as payment success.
    router.push("/checkout/confirmation");
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <h1 className="font-display text-3xl text-on-surface font-semibold">
              Your cart is empty
            </h1>
            <p className="text-on-surface-variant text-base">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-surface">
      {/* ── Breadcrumb ── */}
      <section className="w-full bg-surface-container-low py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-on-surface-variant">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[13px] font-semibold"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-outline-variant">/</span>
            <Link href="/cart" className="hover:text-primary transition-colors">
              Cart ({totalItems})
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">Secure Checkout</span>
          </nav>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
            <Lock className="w-4 h-4 text-primary" strokeWidth={2} />
            Secure Encrypted Checkout
          </div>
        </div>
      </section>

      {/* ── Checkout workspace ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-14 pt-6">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <CheckoutForm />
              </div>
              <div className="lg:col-span-5">
                <OrderSummary items={items} subtotal={subtotal} />
              </div>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
}
