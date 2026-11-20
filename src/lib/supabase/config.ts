import { z } from "zod";

const publicConfig = z.object({
  url: z.url({ protocol: /^https?$/ }),
  key: z.string().startsWith("sb_publishable_"),
});

export function getSupabaseConfig() {
  const result = publicConfig.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  return result.success ? result.data : null;
}

// Supabase Auth is accessed on the server, so browser JavaScript needs no session cookies.
export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
