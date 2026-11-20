import Link from "next/link";
import { MapPreview } from "../components/map-preview";
import { filterParkings, parkingDistricts } from "./parking-data";

export const metadata = { title: "Estacionamientos" };

export default async function ParkingPage({ searchParams }: { searchParams: Promise<{ distrito?: string | string[] }> }) {
  const { distrito } = await searchParams;
  const { district, items, valid } = filterParkings(distrito);
  return (
    <main className="auth-panel moderation-panel">
      <Link className="auth-back" href="/mapa">Volver al mapa</Link>
      <h1>Estacionamientos</h1>
      <p>Ubicaciones ficticias de demostración. La disponibilidad se debe verificar antes de un viaje.</p>
      <form className="auth-form" action="/estacionamientos">
        <div className="auth-field">
          <label htmlFor="parking-district">Distrito</label>
          <select id="parking-district" name="distrito" defaultValue={district}>
            <option value="">Todos los distritos</option>
            {parkingDistricts.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <button className="auth-button" type="submit">Filtrar estacionamientos</button>
      </form>
      {!valid && <p className="result-note" role="alert">Selecciona un distrito disponible.</p>}
      {valid && items.length > 0 ? (
        <>
          <div className="route-result"><MapPreview key={district || "all"} label="Mapa de estacionamientos de muestra" pins={items.map(({ id, position, name }) => ({ position, label: name, detailHref: `/estacionamientos/${id}` }))} /></div>
          <ul className="parking-list">
            {items.map((parking) => <li key={parking.id}><Link className="auth-back" href={`/estacionamientos/${parking.id}`}>{parking.name}</Link> · {parking.district}</li>)}
          </ul>
        </>
      ) : valid && <p className="result-note" role="status">No hay estacionamientos de muestra {district ? `en ${district}` : "registrados"}.</p>}
      {district && <p className="result-note"><Link className="auth-back" href="/estacionamientos">Ver todos los distritos</Link></p>}
    </main>
  );
}
