import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseConfig } from "../../lib/supabase/config";
import { createClient } from "../../lib/supabase/server";
import { SignOutForm } from "../acceso/auth-forms";

export const metadata: Metadata = { title: "Mi cuenta" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  if (!getSupabaseConfig()) redirect("/acceso");

  const supabase = await createClient({ readOnly: true });
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims.sub || data.claims.role !== "authenticated") redirect("/acceso");

  return (
    <main className="auth-panel">
      <Link className="auth-back" href="/mapa">Volver al mapa</Link>
      <h1>Mi cuenta</h1>
      {typeof data.claims.email === "string" && <p>{data.claims.email}</p>}
      <SignOutForm />
    </main>
  );
}
