import type { Metadata } from "next";
import Link from "next/link";
import { requireAccount } from "../../lib/supabase/account";
import { SignOutForm } from "../acceso/auth-forms";

export const metadata: Metadata = { title: "Mi cuenta" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { claims, supabase } = await requireAccount();
  const { data: moderator } = await supabase.rpc("is_risk_moderator");

  return (
    <main className="auth-panel">
      <Link className="auth-back" href="/mapa">Volver al mapa</Link>
      <h1>Mi cuenta</h1>
      {typeof claims.email === "string" && <p>{claims.email}</p>}
      <p><Link className="auth-back" href="/reportes/nuevo">Registrar un reporte de riesgo</Link></p>
      {moderator === true && <p><Link className="auth-back" href="/moderacion">Moderación de reportes</Link></p>}
      <SignOutForm />
    </main>
  );
}
