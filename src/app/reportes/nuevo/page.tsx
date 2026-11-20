import Link from "next/link";
import { requireAccount } from "../../../lib/supabase/account";
import { ReportForm } from "./report-form";

export const metadata = { title: "Registrar un reporte" };
export const dynamic = "force-dynamic";

export default async function NewReportPage() {
  await requireAccount();
  return (
    <main className="auth-panel">
      <Link className="auth-back" href="/cuenta">Volver a mi cuenta</Link>
      <h1>Registrar un reporte</h1>
      <p>Describe el riesgo sin incluir nombres, teléfonos ni datos personales.</p>
      <ReportForm />
    </main>
  );
}
