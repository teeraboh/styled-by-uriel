// ============================================
// Styled by Uriel — Environment Variable Access
// The ONLY place process.env is read directly.
// See: security.md — no scattered process.env reads.
// ============================================

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check .env.local against .env.example.`
    );
  }
  return value;
}

// ── Public (safe for client) ──

export const env = {
  /** Supabase project URL (public) */
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  /** Supabase anonymous key (public, safe for browser) */
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  /** Flutterwave public key (safe for browser) */
  FLUTTERWAVE_PUBLIC_KEY: process.env.FLUTTERWAVE_PUBLIC_KEY ?? "",
  /** App URL for redirects */
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

function optionalEnv(name: string, fallback = ""): string {
  return process.env[name] || fallback;
}

// ── Server-only (NEVER import from client components) ──

export function getServerEnv() {
  return {
    SUPABASE_SERVICE_ROLE_KEY: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    FLUTTERWAVE_SECRET_KEY: optionalEnv("FLUTTERWAVE_SECRET_KEY"),
    FLUTTERWAVE_WEBHOOK_HASH: optionalEnv("FLUTTERWAVE_WEBHOOK_HASH"),
    RESEND_API_KEY: optionalEnv("RESEND_API_KEY"),
    RESEND_TEST_EMAIL: optionalEnv("RESEND_TEST_EMAIL"),
    VENDOR_EMAIL: optionalEnv("VENDOR_EMAIL"),
  } as const;
}

