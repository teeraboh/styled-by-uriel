"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Lock, ArrowRight, Store, AlertCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("Styledbyuriel1@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Bot detection check (honeypot)
    if (honeypot) {
      setErrorMessage("Automated request detected. Access denied.");
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Invalid login credentials. Please check your details.");
        setLoading(false);
        return;
      }

      if (data?.session) {
        router.refresh();
        router.push(fromUrl);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("[VendorLogin] Exception during login:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
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
            autoComplete="email"
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 pr-10 bg-[#fff1eb] text-[#221a16] text-[13px] rounded-lg border border-[#f0dfd8] focus:outline-none focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-[#71523c]/60 hover:text-[#71523c] hover:bg-[#f0dfd8]/50 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[#8c6a53] text-[#fff5f0] text-[13px] font-bold uppercase tracking-wider hover:bg-[#71523c] transition-colors shadow-xs flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60"
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
  );
}

export default function VendorLoginPage() {
  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-on-surface-variant">Loading vendor portal...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
