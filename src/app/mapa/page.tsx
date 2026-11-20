import type { Metadata } from "next";
import Link from "next/link";
import { CycleLaneMap } from "./cycle-lane-map";
import { demoDistricts, demoLanes } from "./demo-lanes";

export const metadata: Metadata = { title: "Mapa de ciclovías" };

export default function MapPage() {
  return (
    <div className="atlas">
      <header className="atlas-header">
        <span className="wordmark">Bici<span>Lima</span></span>
        <Link className="atlas-account" href="/cuenta" prefetch={false}>Mi cuenta</Link>
      </header>

      <main>
        <CycleLaneMap lanes={demoLanes} districts={demoDistricts} />
      </main>
    </div>
  );
}
