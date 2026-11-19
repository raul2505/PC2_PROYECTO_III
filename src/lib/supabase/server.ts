import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const publicConfig = z.object({
  url: z.url({ protocol: /^https?$/ }),
  key: z.string().startsWith("sb_publishable_"),
});

export async function createClient() {
  const config = publicConfig.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!config.success) {
    throw new Error("Configura la URL y la clave publicable de Supabase.");
  }

  const cookieStore = await cookies();

  return createServerClient(config.data.url, config.data.key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}
