import type { Coordinates } from "../components/map-preview";
import { demoDistricts } from "../mapa/demo-lanes";

export type Parking = { id: string; name: string; district: string; position: Coordinates };

export const demoParkings: Parking[] = [
  { id: "centro", name: "Punto de muestra Centro", district: "Cercado de Lima", position: [-12.061, -77.042] },
  { id: "oeste", name: "Punto de muestra Oeste", district: "Pueblo Libre", position: [-12.083, -77.064] },
  { id: "sur", name: "Punto de muestra Sur", district: "San Isidro", position: [-12.101, -77.037] },
];

export const parkingDistricts = demoDistricts;

export function filterParkings(district: string | string[] | undefined) {
  if (district === undefined || district === "") return { district: "", items: demoParkings, valid: true };
  if (typeof district !== "string" || !parkingDistricts.includes(district)) return { district: "", items: [], valid: false };
  return { district, items: demoParkings.filter((parking) => parking.district === district), valid: true };
}
