import type { Metadata } from "next";
import { CycleLaneMap } from "./cycle-lane-map";
import { demoDistricts, demoLanes } from "./demo-lanes";

export const metadata: Metadata = { title: "Mapa de ciclovías" };

export default function MapPage() {
  return (
    <div className="atlas">
      <header className="atlas-header">
        <span className="wordmark">Bici<span>Lima</span></span>
        <span className="city-label">Lima Metropolitana</span>
      </header>

      <main>
        <CycleLaneMap lanes={demoLanes} districts={demoDistricts} />
      </main>
    </div>
  );
}
