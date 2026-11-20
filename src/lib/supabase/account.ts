import { redirect } from "next/navigation";
import { getSupabaseConfig } from "./config";
import { createClient } from "./server";

export async function getAccount(readOnly = false) {
  if (!getSupabaseConfig()) return null;
  const supabase = await createClient({ readOnly });
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims.sub || data.claims.role !== "authenticated") return null;
  return { supabase, claims: data.claims };
}

export async function requireAccount() {
  const account = await getAccount(true);
  if (!account) redirect("/acceso");
  return account;
}
