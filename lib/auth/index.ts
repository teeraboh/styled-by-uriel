import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface VendorSession {
  userId: string;
  email: string;
  role: "vendor";
}

/**
 * Validates vendor session on the server via Supabase Auth.
 * Used inside Server Components and API Route Handlers.
 */
export async function getVendorSession(): Promise<VendorSession | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      role: "vendor",
    };
  } catch {
    return null;
  }
}

/**
 * Enforces vendor authentication on server-side functions and API routes.
 * Throws redirect to /login if unauthorized.
 */
export async function requireVendor(): Promise<VendorSession> {
  const session = await getVendorSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
