import Link from "next/link";
import { MapPreview } from "../components/map-preview";
import { demoParkings } from "./parking-data";

export const metadata = { title: "Estacionamientos" };

export default function ParkingPage() {
  return (
    <main className="auth-panel moderation-panel">
      <Link className="auth-back" href="/mapa">Volver al mapa</Link>
      <h1>Estacionamientos</h1>
      <p>Ubicaciones ficticias de demostración. La disponibilidad se debe verificar antes de un viaje.</p>
      {demoParkings.length > 0 ? (
        <>
          <MapPreview label="Mapa de estacionamientos de muestra" pins={demoParkings.map(({ position, name }) => ({ position, label: name }))} />
          <ul className="parking-list">{demoParkings.map((parking) => <li key={parking.id}>{parking.name} · {parking.district}</li>)}</ul>
        </>
      ) : <p role="status">No hay estacionamientos de muestra registrados.</p>}
    </main>
  );
}
