import type { Metadata } from "next";
import { CycleLaneMap } from "./cycle-lane-map";
import { demoLanes } from "./demo-lanes";

export const metadata: Metadata = { title: "Mapa de ciclovías" };

export default function MapPage() {
  return (
    <div className="atlas">
      <header className="atlas-header">
        <span className="wordmark">Bici<span>Lima</span></span>
        <span className="city-label">Lima Metropolitana</span>
      </header>

      <main className="atlas-content">
        <aside className="map-guide" aria-labelledby="map-heading">
          <div>
            <h1 id="map-heading">Mapa de <span>ciclovías</span></h1>
            <p>Explora los trazados disponibles y ubícalos en Lima.</p>
          </div>

          <div className="map-legend">
            <span className="legend-line" aria-hidden="true" />
            <div>
              <strong>Trazados de demostración</strong>
              <p id="map-scope">Son geometrías ficticias. No las uses para planificar un viaje.</p>
            </div>
          </div>
        </aside>

        <CycleLaneMap lanes={demoLanes} />
      </main>
    </div>
  );
}
