"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, AlertCircle, AlertTriangle } from "lucide-react";
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

function PaymentStatusNotice() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  if (!errorParam) return null;

  let title = "Payment Incomplete";
  let message = "Your payment could not be completed. Your items remain in your bag so you can try again.";

  if (errorParam === "payment_cancelled") {
    title = "Payment Cancelled";
    message = "You cancelled the payment on Flutterwave. Your selected items are still in your bag below so you can proceed whenever you are ready.";
  } else if (errorParam === "payment_not_successful") {
    title = "Payment Failed";
    message = "The payment transaction was not successful. Please check your card or bank account and try again.";
  }

  return (
    <div className="mb-6 p-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-start gap-3 animate-in fade-in duration-200">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-bold">{title}</p>
        <p className="mt-0.5">{message}</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const subtotal = getTotalPrice();
  const totalItems = getTotalItems();

  const onSubmit = async (formData: CheckoutFormValues) => {
    if (items.length === 0) {
      setSubmitError("Your cart is empty. Please add items before checking out.");
      return;
    }

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validItems = items.filter((item) => UUID_REGEX.test(item.productId));

    if (validItems.length === 0) {
      clearCart();
      setSubmitError(
        "Your cart contained items from an earlier session with outdated product IDs. The cart has been refreshed. Please add current items from the shop."
      );
      return;
    }

    setSubmitError(null);

    try {
      // 1. Create pending order in Supabase
      const payload = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          streetAddress: formData.streetAddress,
          landmark: formData.landmark || undefined,
          state: formData.state,
          city: formData.city,
          shippingMethod: formData.shippingMethod,
          orderNotes: formData.orderNotes || undefined,
          whatsappUpdates: formData.whatsappUpdates ?? false,
          termsAgreed: formData.termsAgreed,
        },
        items: validItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedColour: item.selectedColour ?? null,
          selectedSize: item.selectedSize ?? null,
        })),
      };

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error?.message || "Failed to create order. Please try again.");
      }

      const orderId = orderData.orderId;

      // 2. Initialize Flutterwave hosted payment session
      // Note: We DO NOT clear the cart yet so the user's bag is preserved if payment is abandoned.
      const paymentRes = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok || !paymentData.paymentLink) {
        throw new Error(
          paymentData.error?.message || "Failed to initialize Flutterwave payment. Please try again."
        );
      }

      // 3. Redirect customer directly to Flutterwave hosted checkout link
      window.location.href = paymentData.paymentLink;
    } catch (err: unknown) {
      console.error("[CheckoutPage] Order submission / payment initiation error:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while processing your order. Please try again."
      );
    }
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
            <Suspense fallback={null}>
              <PaymentStatusNotice />
            </Suspense>

            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container border border-error/20 flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Unable to place order</p>
                  <p className="mt-0.5">{submitError}</p>
                </div>
              </div>
            )}
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
