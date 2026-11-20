import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findParking, parkingConditions } from "../parking-data";

export const metadata = { title: "Ficha de estacionamiento" };

export default async function ParkingDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parking = findParking(id);
  if (!parking) notFound();

  return (
    <main className="auth-panel moderation-panel">
      <Link className="auth-back" href="/estacionamientos">Volver a estacionamientos</Link>
      <h1>{parking.name}</h1>
      <p>Ficha de demostración. La ubicación y las condiciones de muestra son ficticias.</p>
      <dl className="parking-details">
        <dt>Distrito de referencia</dt><dd>{parking.district}</dd>
        <dt>Ubicación de muestra</dt><dd>{parking.position.map((value) => value.toFixed(5)).join(", ")}</dd>
        {parkingConditions(parking).map(([label, value]) => <Fragment key={label}><dt>{label}</dt><dd>{value}</dd></Fragment>)}
      </dl>
    </main>
  );
}
