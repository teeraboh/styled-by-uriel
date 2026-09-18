"use client";

import { useFormContext } from "react-hook-form";
import { ChevronDown, BadgeCheck } from "lucide-react";
import type { CheckoutFormValues } from "@/lib/validation/checkout";

const NIGERIAN_STATES = [
  "Lagos State",
  "Abuja (FCT)",
  "Abia State (Local Aba Hub)",
  "Rivers State (Port Harcourt)",
  "Enugu State",
  "Kano State",
  "Anambra State (Onitsha / Awka)",
  "Oyo State (Ibadan)",
  "Delta State (Asaba / Warri)",
  "Imo State (Owerri)",
  "Ogun State",
  "Edo State (Benin)",
];

const inputClass =
  "w-full bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

const labelClass =
  "block text-[13px] font-semibold text-on-surface mb-1";

const errorClass = "mt-1 text-xs text-error";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={errorClass}>{message}</p>;
}

export function CheckoutForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

  return (
    <div className="flex flex-col gap-6">
      {/* ── Step 1: Contact ── */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-lg font-bold text-on-surface">Contact Information</h2>
          </div>
          <span className="text-xs text-on-surface-variant">Step 1 of 3</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="checkout-email">
              Email Address <span className="text-error">*</span>
            </label>
            <input
              id="checkout-email"
              className={inputClass}
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
            <p className="mt-1 text-xs text-on-surface-variant">
              We send your instant order confirmation here.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="checkout-phone">
              WhatsApp / Phone Number <span className="text-error">*</span>
            </label>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-4 bg-surface-container-low text-on-surface text-sm rounded-lg">
                +234
              </span>
              <input
                id="checkout-phone"
                className={inputClass}
                placeholder="0801 234 5678"
                type="tel"
                autoComplete="tel"
                {...register("phone")}
              />
            </div>
            <FieldError message={errors.phone?.message} />
            <p className="mt-1 text-xs text-on-surface-variant">
              Essential for courier coordination upon delivery.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-1 rounded accent-primary w-4 h-4 cursor-pointer"
                {...register("whatsappUpdates")}
              />
              <span className="text-xs text-on-surface">
                Keep me updated on WhatsApp with delivery milestones.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Step 2: Delivery ── */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-lg font-bold text-on-surface">
              Delivery Details (Nigeria)
            </h2>
          </div>
          <span className="text-xs text-on-surface-variant">Step 2 of 3</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="recipient-first-name">
              First Name <span className="text-error">*</span>
            </label>
            <input
              id="recipient-first-name"
              className={inputClass}
              type="text"
              autoComplete="given-name"
              {...register("firstName")}
            />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div>
            <label className={labelClass} htmlFor="recipient-last-name">
              Last Name <span className="text-error">*</span>
            </label>
            <input
              id="recipient-last-name"
              className={inputClass}
              type="text"
              autoComplete="family-name"
              {...register("lastName")}
            />
            <FieldError message={errors.lastName?.message} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="street-address">
              Street Address <span className="text-error">*</span>
            </label>
            <input
              id="street-address"
              className={inputClass}
              placeholder="House number and street name"
              type="text"
              autoComplete="street-address"
              {...register("streetAddress")}
            />
            <FieldError message={errors.streetAddress?.message} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="landmark">
              Landmark / Building Suite (Optional)
            </label>
            <input
              id="landmark"
              className={inputClass}
              placeholder="e.g. Opposite Central Mosque"
              type="text"
              {...register("landmark")}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="state-select">
              State / Region <span className="text-error">*</span>
            </label>
            <div className="relative">
              <select
                id="state-select"
                className={`${inputClass} appearance-none pr-10`}
                defaultValue=""
                {...register("state")}
              >
                <option value="" disabled>
                  Select state
                </option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-on-surface-variant pointer-events-none" />
            </div>
            <FieldError message={errors.state?.message} />
          </div>
          <div>
            <label className={labelClass} htmlFor="city-input">
              City / Town <span className="text-error">*</span>
            </label>
            <input
              id="city-input"
              className={inputClass}
              type="text"
              {...register("city")}
            />
            <FieldError message={errors.city?.message} />
          </div>
        </div>

        {/* Shipping method */}
        <div className="mt-6">
          <label className={labelClass}>Select Shipping Method</label>
          <div className="space-y-2">
            {[
              {
                value: "standard",
                title: "Standard Interstate Courier",
                text: "Nationwide dispatch from Aba",
              },
              {
                value: "express",
                title: "Priority Express",
                text: "Faster delivery available",
              },
              {
                value: "pickup",
                title: "Local Aba Atelier Pickup",
                text: "Collection at Enyimba Market, Aba",
              },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    value={option.value}
                    className="accent-primary w-4 h-4"
                    {...register("shippingMethod")}
                  />
                  <div>
                    <span className="block text-sm font-bold text-on-surface">
                      {option.title}
                    </span>
                    <span className="block text-xs text-on-surface-variant">
                      {option.text}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Cost at checkout
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Step 3: Payment ── */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-lg font-bold text-on-surface">Payment Method</h2>
          </div>
          <span className="text-xs text-on-surface-variant">Step 3 of 3</span>
        </div>

        <div className="bg-surface-container-high p-4 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                checked
                readOnly
                className="mt-1 accent-primary w-4 h-4"
                aria-label="Flutterwave payment"
              />
              <div>
                <span className="text-sm font-bold text-on-surface">
                  Instant Payment via Flutterwave
                </span>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Pay securely via Flutterwave (Cards, USSD, Bank Transfer).
                </p>
              </div>
            </div>
            <BadgeCheck className="w-5 h-5 text-primary shrink-0" strokeWidth={2} />
          </div>
          <div className="mt-3 pl-7 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <span className="px-2 py-1 bg-surface-container-lowest rounded text-primary">
              Secured by Flutterwave
            </span>
            <span className="px-2 py-1 bg-surface-container-lowest rounded text-on-surface-variant">
              Cards &amp; Transfers
            </span>
          </div>
        </div>

        <div className="mt-6">
          <label className={labelClass} htmlFor="order-notes">
            Tailoring / Delivery Notes (Optional)
          </label>
          <textarea
            id="order-notes"
            className={`${inputClass} resize-none`}
            placeholder="e.g. Please hem trousers for exact height, leave at security post if unavailable..."
            rows={2}
            {...register("orderNotes")}
          />
        </div>
      </div>
    </div>
  );
}
