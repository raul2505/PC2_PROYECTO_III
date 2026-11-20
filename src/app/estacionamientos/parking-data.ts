import type { Coordinates } from "../components/map-preview";

export type Parking = { id: string; name: string; district: string; position: Coordinates };

export const demoParkings: Parking[] = [
  { id: "centro", name: "Punto de muestra Centro", district: "Cercado de Lima", position: [-12.061, -77.042] },
  { id: "oeste", name: "Punto de muestra Oeste", district: "Pueblo Libre", position: [-12.083, -77.064] },
  { id: "sur", name: "Punto de muestra Sur", district: "San Isidro", position: [-12.101, -77.037] },
];
