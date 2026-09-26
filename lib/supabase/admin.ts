import { createClient } from "@supabase/supabase-js";
import { env, getServerEnv } from "@/lib/env";

/**
 * Server-only Supabase Admin Client.
 * Uses the privileged SERVICE_ROLE_KEY to bypass RLS for server background jobs
 * (e.g. Flutterwave payment webhooks, system ledger logs).
 * 
 * NEVER import this into client components or expose to the browser!
 */
export function createAdminClient() {
  const serverEnv = getServerEnv();
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co",
    serverEnv.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
