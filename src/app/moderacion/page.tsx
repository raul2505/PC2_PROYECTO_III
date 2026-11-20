import Link from "next/link";
import { requireAccount } from "../../lib/supabase/account";
import { riskTypes } from "../reportes/nuevo/fields";
import { ReviewForm } from "./review-form";

export const metadata = { title: "Moderación de reportes" };
export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  const { supabase } = await requireAccount();
  const role = await supabase.rpc("is_risk_moderator");
  const canReview = role.data === true;
  const reports = canReview
    ? await supabase.from("risk_reports").select("id,type,description,latitude,longitude,created_at").eq("status", "pending").order("created_at", { ascending: false }).limit(100)
    : null;

  return (
    <main className="auth-panel moderation-panel">
      <Link className="auth-back" href="/cuenta">Volver a mi cuenta</Link>
      <h1>Moderación de reportes</h1>
      {!canReview && <p role="alert">Solo los moderadores pueden revisar reportes.</p>}
      {reports?.error && <p role="alert">No fue posible consultar los reportes pendientes.</p>}
      {reports?.data?.length === 0 && <p role="status">No hay reportes pendientes.</p>}
      {reports?.data?.map((report) => (
        <article className="review-item" key={report.id}>
          <h2>{riskTypes[report.type as keyof typeof riskTypes]}</h2>
          <p>{report.description}</p>
          <p>{report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}</p>
          <ReviewForm id={report.id} />
        </article>
      ))}
    </main>
  );
}
