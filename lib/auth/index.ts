import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface VendorSession {
  userId: string;
  email: string;
  role: "vendor";
  iat: number;
}

/**
 * Validates vendor session on the server.
 * Used inside Server Components and API Route Handlers.
 */
export async function getVendorSession(): Promise<VendorSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("sbu_vendor_session");

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    ) as VendorSession;

    if (session.role !== "vendor" || !session.userId) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Enforces vendor authentication on server-side functions and API routes.
 * Throws redirect or 401 error if unauthorized.
 */
export async function requireVendor(): Promise<VendorSession> {
  const session = await getVendorSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
