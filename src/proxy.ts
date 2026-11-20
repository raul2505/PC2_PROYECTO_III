import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig, sessionCookieOptions } from "./lib/supabase/config";

export async function proxy(request: NextRequest) {
  const options = getSupabaseConfig();
  let response = NextResponse.next({ request });
  if (!options) return response;

  const supabase = createServerClient(options.url, options.key, {
    cookieOptions: sessionCookieOptions,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies, headers) {
        for (const { name, value } of cookies) request.cookies.set(name, value);

        const previousCookies = response.cookies.getAll();
        response = NextResponse.next({ request });
        for (const cookie of previousCookies) response.cookies.set(cookie);
        for (const { name, value, options } of cookies) response.cookies.set(name, value, options);
        for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
      },
    },
  });

  await supabase.auth.getClaims();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/cuenta/:path*"] };
