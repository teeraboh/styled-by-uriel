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

// ── Server-only (NEVER import from client components) ──

export function getServerEnv() {
  return {
    SUPABASE_SERVICE_ROLE_KEY: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    FLUTTERWAVE_SECRET_KEY: requireEnv("FLUTTERWAVE_SECRET_KEY"),
    FLUTTERWAVE_WEBHOOK_HASH: requireEnv("FLUTTERWAVE_WEBHOOK_HASH"),
  } as const;
}
