"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, ArrowRight, Store, AlertCircle } from "lucide-react";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("natasha@styledbyuriel.com");
  const [password, setPassword] = useState("••••••••");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Bot detection check (honeypot)
    if (honeypot) {
      setErrorMessage("Automated request detected. Access denied.");
      return;
    }

    setLoading(true);

    // Simulate authenticating against Supabase Auth and creating encrypted cookie
    setTimeout(() => {
      // Set secure session cookie (in production httpOnly is set by server action / API route)
      const sessionData = {
        userId: "vendor-natasha-001",
        email,
        role: "vendor",
        iat: Date.now(),
      };
      document.cookie = `sbu_vendor_session=${btoa(
        JSON.stringify(sessionData)
      )}; path=/; max-age=86400; SameSite=Lax; ${
        window.location.protocol === "https:" ? "Secure;" : ""
      }`;

      router.push("/dashboard");
    }, 600);
  };

  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-7 sm:p-8 shadow-xl border border-[#f0dfd8]/70 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fceae3] text-[#71523c] text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handcrafted in Aba</span>
          </div>

          <h1 className="font-serif text-3xl text-[#221a16] font-bold tracking-tight">
            Vendor Portal
          </h1>
          <p className="text-[13px] text-[#50453e]">
            Enyimba Atelier Suite • Artisan Production &amp; Dispatch Desk
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-lg text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Honeypot field for bot protection (hidden from humans) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company_website">Company Website</label>
            <input
              id="company_website"
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
              Merchant Atelier Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#50453e]">
                Security PIN / Password
              </label>
              <a
                href="https://wa.me/2347039315917"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#71523c] hover:underline"
              >
                Reset via WhatsApp
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#8c6a53] text-[#fff5f0] text-[13px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Enter Vendor Suite</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link back to storefront */}
        <div className="pt-4 border-t border-[#f0dfd8] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#50453e] hover:text-[#71523c] transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Return to Public Storefront</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
