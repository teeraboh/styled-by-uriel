"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

// Placeholder brand emblems — Stitch-generated, replace with real brand assets
const FOOTER_LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAo9qWn4kIoV0Mj9V9u0MMxFNSLvHdUvYeiaQv1vJxmVP26NaCFLVh3pOkWAfumDnCnqnRgLxku-EpKynHmAimpm_jzCjuibk0K51nWsV6I8d7dctDd1mRc7RPow9bdJ0BaAyMq6gQXWk-WLRtPyY5adZ1UuNzC9wx49ymWQ3CPX5iBVGMbuFj3CmyD7vhAabptfjBcH5RUujJt5c5nvYRTtsYCFMCziVIF7FOLknUZ-Wt8-kW1sdfxE-33Wx8FG6D3tg";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
] as const;

const WHATSAPP_URL =
  "https://wa.me/2347039315917?text=Hello%20Styled%20by%20Uriel%2C%20I%27m%20shopping%20from%20your%20website%20and%20need%20assistance!";

function InstagramIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail("");
    }, 600);
  };

  return (
    <footer
      className="bg-brand-cream text-brand-dark-brown pt-16 pb-8 border-t border-brand-beige/50"
      data-purpose="site-footer"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 items-start">
          {/* Logo card */}
          <div className="flex items-start">
            <div className="bg-white rounded-lg border border-brand-beige/80 p-3 shadow-sm inline-block">
              <Image
                src={FOOTER_LOGO_URL}
                alt="Styled by Uriel"
                width={180}
                height={56}
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-dark-brown mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-3 text-sm text-on-surface-variant font-normal">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-warm-brown transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow us */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-dark-brown mb-4">
              FOLLOW US
            </h4>
            <div className="flex items-center gap-2 mb-4 text-brand-dark-brown">
              <a
                href="https://instagram.com/official_styledbyuriel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-brand-beige flex items-center justify-center hover:bg-brand-warm-brown hover:border-brand-warm-brown hover:text-white transition duration-200"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://tiktok.com/@styledbyuriel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full border border-brand-beige flex items-center justify-center hover:bg-brand-warm-brown hover:border-brand-warm-brown hover:text-white transition duration-200"
              >
                <TikTokIcon />
              </a>
            </div>
            <p className="text-sm text-on-surface-variant font-medium">@styledbyuriel</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Cute. Comfy. Stylish.</p>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-dark-brown mb-2">
              NEWSLETTER
            </h4>
            <p className="text-xs text-on-surface-variant leading-snug mb-4">
              Get exclusive updates, new arrivals
              <br />
              and special offers.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] p-3 rounded-lg text-xs font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you for subscribing to Styled by Uriel!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="relative flex items-center w-full max-w-sm"
              >
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  className="w-full bg-white border-brand-beige rounded-lg py-2.5 pl-3 pr-12 text-xs focus-visible:ring-brand-warm-brown"
                />
                <Button
                  aria-label="Subscribe"
                  size="icon"
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1 top-1 bottom-1 h-auto px-3 bg-brand-warm-brown hover:bg-brand-warm-brown-dark text-white rounded-md"
                >
                  {isSubmitting ? "…" : "→"}
                </Button>
              </form>
            )}

            <div className="pt-5 select-none pointer-events-none">
              <p className="font-script text-3xl sm:text-4xl text-brand-warm-brown leading-none font-bold">
                Wear Confidence ♡
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-beige/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} Styled by Uriel. All Rights Reserved.
          </p>
          <a
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
            href={WHATSAPP_URL}
            rel="noopener"
            target="_blank"
          >
            <WhatsAppIcon />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
