import type { Metadata } from "next";
import Link from "next/link";
import { listPublicAlerts } from "../../lib/supabase/public-alerts";
import { CycleLaneMap } from "./cycle-lane-map";
import { demoDistricts, demoLanes } from "./demo-lanes";

export const metadata: Metadata = { title: "Mapa de ciclovías" };
export const dynamic = "force-dynamic";

export default async function MapPage() {
  const alerts = await listPublicAlerts();
  return (
    <div className="atlas">
      <header className="atlas-header">
        <span className="wordmark">Bici<span>Lima</span></span>
        <nav className="atlas-nav" aria-label="Navegación principal">
          <Link className="atlas-account" href="/rutas">Recorridos</Link>
          <Link className="atlas-account" href="/cuenta" prefetch={false}>Mi cuenta</Link>
        </nav>
      </header>

      <main>
        <CycleLaneMap lanes={demoLanes} districts={demoDistricts} alerts={alerts} />
      </main>
    </div>
  );
}
