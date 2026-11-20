"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseConfig } from "../../lib/supabase/config";
import { createClient } from "../../lib/supabase/server";

const credentialsSchema = z.object({
  email: z.string().trim().pipe(z.email().max(254)),
  password: z.string().min(1).max(1024),
});

const unavailable = "El acceso no está disponible en este momento. Inténtalo más tarde.";

export async function signIn(_previous: string | null, form: FormData): Promise<string | null> {
  const credentials = credentialsSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!credentials.success) return "Ingresa un correo válido y tu contraseña.";
  if (!getSupabaseConfig()) return unavailable;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(credentials.data);

  if (error?.status === 429) return "Demasiados intentos. Espera un momento y vuelve a intentarlo.";
  if (error?.name === "AuthRetryableFetchError" || (error?.status ?? 0) >= 500) return unavailable;
  if (error || !data?.session) return "No se pudo iniciar sesión. Revisa tu correo y contraseña.";

  redirect("/cuenta");
}

export async function signOut(): Promise<string | null> {
  if (!getSupabaseConfig()) return unavailable;

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) return "No se pudo cerrar la sesión. Inténtalo de nuevo.";

  redirect("/acceso");
}
