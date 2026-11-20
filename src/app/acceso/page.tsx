import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseConfig } from "../../lib/supabase/config";
import { LoginForm } from "./auth-forms";

export const metadata: Metadata = { title: "Iniciar sesión" };
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="auth-panel">
      <Link className="auth-back" href="/mapa">Volver al mapa</Link>
      <h1>Iniciar sesión</h1>
      {getSupabaseConfig()
        ? <LoginForm />
        : <p role="status">El acceso a la cuenta todavía no está disponible.</p>}
    </main>
  );
}
