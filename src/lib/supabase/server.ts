import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig, sessionCookieOptions } from "./config";

export async function createClient({ readOnly = false } = {}) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Configura la URL y la clave publicable de Supabase.");
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.key, {
    cookieOptions: sessionCookieOptions,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        if (readOnly) return;
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}
