import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Admin client using SUPABASE_SERVICE_ROLE_KEY — bypasses RLS entirely.
 * Use this during development when auth is not yet implemented.
 */
export function createAdminSupabaseClient(): SupabaseClient<Database> {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * Get the default (first) user ID from profiles.
 * Falls back to trying auth; if no user at all, returns null.
 */
export async function getDefaultUserId(
  supabase: SupabaseClient<Database>
): Promise<string | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .limit(1)
    .single();
  return data?.id ?? null;
}

/** SSR-aware client for Server Components & Server Actions (cookie-based auth) */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // The `set` method was called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Same as above
          }
        },
      },
    }
  );
}

/**
 * Fully-typed Supabase client for API Route Handlers.
 * Uses @supabase/supabase-js createClient which correctly infers Database generics.
 * Reads the Supabase auth token from cookies to maintain the user session.
 */
export function createApiSupabaseClient(): SupabaseClient<Database> {
  // DEV MODE: use admin client to bypass RLS when no auth is configured
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createAdminSupabaseClient();
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {},
      },
    }
  );

  // If we have tokens, set the session
  if (accessToken && refreshToken) {
    client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  }

  return client;
}
