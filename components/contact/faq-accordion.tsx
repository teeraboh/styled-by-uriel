"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Can I visit the showroom without a prior appointment?",
    answer: (
      <div>
        <p className="mb-2">
          <strong>Yes! Walk-ins are always welcome.</strong> Our Aba showroom is open Monday through
          Saturday from 8:00 AM to 6:00 PM WAT. You can walk in to explore our newest fabric arrivals,
          inspect garment finishes, or bring your children along to try on items in our private kids fitting
          room.
        </p>
      </div>
    ),
  },
  {
    question: "How do physical measurements and child fittings work at the store?",
    answer: (
      <div>
        <p className="mb-2">
          Our showroom specialists provide complimentary fitting consultations for kids of all ages
          (ages 1–12). We measure chest, waist, and height to guarantee an effortless, comfortable fit
          that leaves room for natural growth.
        </p>
        <div className="bg-brand-cream p-3 rounded-lg text-xs font-medium text-brand-dark-brown mt-2 space-y-1">
          <div>
            <strong className="text-brand-warm-brown font-bold">Age 2-3 Yrs:</strong> Chest: 20-21 in |
            Waist: 19-20 in | Height: 88-96 cm
          </div>
          <div>
            <strong className="text-brand-warm-brown font-bold">Age 4-5 Yrs:</strong> Chest: 22-23 in |
            Waist: 21-22 in | Height: 104-110 cm
          </div>
          <div>
            <strong className="text-brand-warm-brown font-bold">Age 6-7 Yrs:</strong> Chest: 24-25 in |
            Waist: 22-23 in | Height: 116-122 cm
          </div>
          <div>
            <strong className="text-brand-warm-brown font-bold">Age 8-10 Yrs:</strong> Chest: 26-28 in |
            Waist: 24-25 in | Height: 128-140 cm
          </div>
        </div>
      </div>
    ),
  },
  {
    question: "How do payments work in-store and online?",
    answer: (
      <div>
        <p>
          We accept direct bank transfers, point-of-sale debit/credit cards (Mastercard, Visa, and
          Verve), and instant cash payments at our showroom checkout desk. Online orders are processed
          through secure Flutterwave checkout.
        </p>
        <ul className="list-disc pl-5 my-2 space-y-1 text-xs">
          <li>Point-of-Sale POS card terminal on-site</li>
          <li>Direct Nigerian Bank Transfer with instant checkout confirmation</li>
          <li>Cash accepted for walk-in purchases</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Can I pick up my order directly in Aba?",
    answer: (
      <div>
        <p>
          <strong>Yes, absolutely!</strong> If you are based in or visiting Aba, Abia State, select{" "}
          <span className="text-brand-warm-brown font-bold">&quot;Local Pickup&quot;</span> during
          checkout on the site or call us at 07039315917 before stopping by.
        </p>
        <p className="mt-2">
          Pickups can be collected at our boutique hub in{" "}
          <strong className="text-brand-dark-brown">Enyimba Market, Aba</strong> from Monday through
          Saturday, between 8:00 AM and 6:00 PM. Our team will pack and have your parcel tagged and
          ready.
        </p>
      </div>
    ),
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <div className="flex flex-col gap-2.5 max-w-3xl mx-auto w-full">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className="bg-white rounded-xl border border-brand-beige/60 shadow-xs overflow-hidden transition-all"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 text-left p-4 sm:p-5 hover:bg-brand-cream/50 transition-colors"
            >
              <span className="text-sm sm:text-base font-bold text-brand-dark-brown">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-brand-warm-brown flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2}
              />
            </button>
            {isOpen && (
              <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-brand-beige/30 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}