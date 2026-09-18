import Link from "next/link";
import { CheckCircle, MessageCircle, Package } from "lucide-react";

interface OrderConfirmationPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const { ref } = await searchParams;
  const orderRef = ref ?? "SBU-2026-0001";

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary-container text-secondary flex items-center justify-center">
            <CheckCircle className="w-10 h-10" strokeWidth={1.5} />
          </div>

          <h1 className="font-display text-4xl text-on-surface font-semibold">
            Order Confirmed!
          </h1>

          <p className="text-on-surface-variant text-base max-w-md mx-auto">
            Thank you for shopping with Styled by Uriel. We&apos;ve received your
            order and will begin preparing it shortly.
          </p>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 max-w-sm mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-2">
              Order Reference
            </p>
            <p className="text-xl font-extrabold text-on-surface tracking-wide">
              #{orderRef}
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-on-surface-variant">
              <Package className="w-4 h-4 text-primary" strokeWidth={1.75} />
              <span>A confirmation has been sent to your email and phone.</span>
            </div>
          </div>

          <div className="w-full h-px bg-outline-variant/20 max-w-xs mx-auto" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Continue Shopping
            </Link>
            <a
              href="https://wa.me/2347039315917"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary hover:text-on-primary px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
              Chat with Us on WhatsApp
            </a>
          </div>

          <p className="text-xs text-on-surface-variant">
            Have questions about your order? Reach out anytime on WhatsApp.
          </p>
        </div>
      </div>
    </main>
  );
}
