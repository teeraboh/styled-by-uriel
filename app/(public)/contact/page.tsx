import {
  Heart,
  Mail,
  Truck,
  Plane,
  Map,
} from "lucide-react";
import FaqAccordion from "@/components/contact/faq-accordion";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export const metadata = {
  title: "Contact Us & Support | Styled by Uriel",
  description:
    "Get in touch with Styled by Uriel for customer orders, sizing guidance, and tracked nationwide delivery across Nigeria.",
};

export default function ContactPage() {
  return (
    <main className="w-full bg-brand-cream/40 min-h-screen">
      {/* Subtle ambient decorative glows */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-sand/50 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-[28rem] h-[28rem] rounded-full bg-brand-beige/40 blur-3xl pointer-events-none" />

        {/* ── 1. Hero / Intro Section ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Crafted in Aba • Shipped Nationwide
              </span>
              <span className="w-8 h-px bg-primary" />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] text-on-surface font-semibold tracking-tight leading-tight mb-3">
              Contact &amp; Customer Support
            </h1>

            <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
              Have questions about your order, sizing, or nationwide delivery? Reach out directly
              to our dedicated support desk.
            </p>

            {/* Decorative cursive flourish */}
            <div className="flex items-center justify-center gap-3 mt-4 opacity-75">
              <div className="w-12 h-px bg-brand-warm-brown" />
              <span className="font-script text-2xl text-brand-warm-brown italic font-bold">
                Uriel
              </span>
              <div className="w-12 h-px bg-brand-warm-brown" />
            </div>
          </div>
        </section>

        {/* ── 2. Dual Cards: Written Inquiries & Inter-State Transit Windows ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Written Inquiries Desk (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-brand-beige/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-warm-brown/10 flex items-center justify-center text-brand-warm-brown">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-brand-dark-brown">
                    Written Inquiries Desk
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-on-surface-variant mb-4 font-medium leading-relaxed">
                  For formal customer orders, invoices, feedback, or collaborations, reach out through
                  our official direct channels:
                </p>

                <div className="flex flex-col gap-3">
                  {/* Email */}
                  <a
                    href="mailto:natashaejike99@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-xl bg-brand-cream hover:bg-brand-sand/60 border border-brand-beige/60 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-warm-brown/10 flex items-center justify-center text-brand-warm-brown group-hover:bg-brand-warm-brown group-hover:text-white transition-colors shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                        Email Desk (Response within 12–24 hrs)
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-brand-dark-brown truncate">
                        natashaejike99@gmail.com
                      </span>
                    </div>
                  </a>

                  {/* Social Handles Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="https://instagram.com/official_styledbyuriel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-cream hover:bg-brand-sand/60 border border-brand-beige/60 transition-colors group"
                    >
                      <InstagramIcon className="w-4 h-4 text-brand-warm-brown group-hover:scale-110 transition-transform shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] uppercase font-bold text-on-surface-variant">
                          Instagram
                        </span>
                        <span className="text-xs font-bold text-brand-dark-brown truncate">
                          @official_styledbyuriel
                        </span>
                      </div>
                    </a>

                    <a
                      href="https://tiktok.com/@styledbyuriel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-cream hover:bg-brand-sand/60 border border-brand-beige/60 transition-colors group"
                    >
                      <span className="text-xs font-bold text-brand-warm-brown">TT</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] uppercase font-bold text-on-surface-variant">
                          TikTok
                        </span>
                        <span className="text-xs font-bold text-brand-dark-brown truncate">
                          @styledbyuriel
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-beige/60 flex items-center justify-between text-xs sm:text-sm text-on-surface-variant">
                <span>Customer Support Line:</span>
                <a
                  href="tel:07039315917"
                  className="text-brand-warm-brown font-bold hover:underline"
                >
                  07039315917
                </a>
              </div>
            </div>

            {/* Inter-State Transit Windows (6 Cols) */}
            <div className="lg:col-span-6 bg-brand-sand/60 rounded-2xl p-6 sm:p-7 shadow-sm border border-brand-beige/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-warm-brown/10 flex items-center justify-center text-brand-warm-brown">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-warm-brown tracking-wider block">
                      Logistics &amp; Dispatch
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-brand-dark-brown">
                      Inter-State Transit Windows
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-on-surface-variant mb-4 font-medium leading-relaxed">
                  Every order packed at our Aba hub is inspected and expedited with tracked
                  nationwide delivery partners across Nigeria.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-on-surface-variant">
                  <li className="flex items-start gap-3 bg-white/80 p-3 rounded-xl border border-brand-beige/60">
                    <Truck className="w-5 h-5 text-brand-warm-brown shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-brand-dark-brown font-bold block">
                        South East (Enugu, Owerri, Port Harcourt)
                      </strong>
                      <span className="text-xs text-on-surface-variant">
                        Next day transit dispatch directly from our Aba terminal.
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 bg-white/80 p-3 rounded-xl border border-brand-beige/60">
                    <Plane className="w-5 h-5 text-brand-warm-brown shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-brand-dark-brown font-bold block">
                        Lagos &amp; Abuja
                      </strong>
                      <span className="text-xs text-on-surface-variant">
                        2 – 3 business days direct door-to-door delivery.
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 bg-white/80 p-3 rounded-xl border border-brand-beige/60">
                    <Map className="w-5 h-5 text-brand-warm-brown shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-brand-dark-brown font-bold block">
                        Northern &amp; Western States
                      </strong>
                      <span className="text-xs text-on-surface-variant">
                        3 – 5 business days via trusted interstate express logistics.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              <p className="text-[11px] text-on-surface-variant mt-6 pt-4 border-t border-brand-beige/60 font-medium">
                All shipments include SMS/phone tracking updates until safely received in your
                hands.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. Frequently Asked Questions Section ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-brand-beige/70">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-[11px] uppercase tracking-widest font-bold text-brand-warm-brown block mb-1">
                Clear Answers
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark-brown">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 font-medium">
                Everything you need to know about placing orders, physical measurements for
                kids, payments, and tracked delivery across Nigeria.
              </p>
            </div>

            <FaqAccordion />
          </div>
        </section>

        {/* ── 4. Bottom Editorial Script Signoff ── */}
        <section className="w-full py-8 text-center border-t border-brand-beige/60">
          <div className="inline-flex items-center gap-2">
            <span className="font-script text-3xl sm:text-4xl text-brand-warm-brown italic font-bold">
              Wear Confidence
            </span>
            <Heart className="w-5 h-5 text-brand-warm-brown fill-brand-warm-brown" />
          </div>
          <p className="text-[10px] sm:text-xs font-bold text-on-surface-variant tracking-[0.25em] uppercase mt-1">
            Styled by Uriel • Aba to the World
          </p>
        </section>
      </div>
    </main>
  );
}