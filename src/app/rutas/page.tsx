import Link from "next/link";
import { MapPreview } from "../components/map-preview";
import { findDemoRoute, readRouteSelection, routePoints } from "./route-data";

export const metadata = { title: "Recorridos ciclistas" };

type Query = { origen?: string | string[]; destino?: string | string[] };

export default async function RoutesPage({ searchParams }: { searchParams: Promise<Query> }) {
  const { origen, destino } = await searchParams;
  const selection = readRouteSelection(origen, destino);
  const route = findDemoRoute(selection);

  return (
    <main className="auth-panel moderation-panel">
      <Link className="auth-back" href="/mapa">Volver al mapa</Link>
      <h1>Recorridos ciclistas</h1>
      <p>Selecciona dos puntos del catálogo de demostración.</p>
      <form className="auth-form" action="/rutas">
        <div className="auth-field">
          <label htmlFor="route-origin">Origen</label>
          <select id="route-origin" name="origen" defaultValue={selection.from?.id ?? ""} required>
            <option value="" disabled>Selecciona un origen</option>
            {routePoints.map((point) => <option key={point.id} value={point.id}>{point.label}</option>)}
          </select>
        </div>
        <div className="auth-field">
          <label htmlFor="route-destination">Destino</label>
          <select id="route-destination" name="destino" defaultValue={selection.to?.id ?? ""} required>
            <option value="" disabled>Selecciona un destino</option>
            {routePoints.map((point) => <option key={point.id} value={point.id}>{point.label}</option>)}
          </select>
        </div>
        <button className="auth-button" type="submit">Consultar recorrido</button>
      </form>
      {selection.requested && !selection.valid && <p className="result-note" role="alert">Selecciona un origen y un destino disponibles y diferentes.</p>}
      {selection.valid && !route && <p className="result-note" role="status">No hay un recorrido disponible entre esos puntos.</p>}
      {route && (
        <section className="route-result" aria-labelledby="route-result-heading">
          <h2 id="route-result-heading">Recorrido sugerido · {route.name}</h2>
          <p>{route.from} → {route.to}</p>
          <p>Geometría de demostración. No la uses para planificar un viaje.</p>
          <MapPreview key={`${origen}-${destino}`} path={route.path} label="Mapa del recorrido sugerido" />
        </section>
      )}
    </main>
  );
}
