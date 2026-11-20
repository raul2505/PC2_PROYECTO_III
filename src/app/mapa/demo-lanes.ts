type Coordinates = [latitude: number, longitude: number];

export type CycleLane = {
  id: string;
  name: string;
  district: string;
  description: string;
  reportedCondition?: string;
  path: Coordinates[];
};

export const demoDistricts = ["Cercado de Lima", "Miraflores", "Pueblo Libre", "San Isidro"];

export function filterLanesByDistrict(lanes: readonly CycleLane[], district: string) {
  return district === "" ? lanes : lanes.filter((lane) => lane.district === district);
}

// Geometrías ficticias para probar el mapa. No representan infraestructura vial.
export const demoLanes: CycleLane[] = [
  {
    id: "centro",
    name: "Tramo Centro",
    district: "Cercado de Lima",
    description: "Ejemplo de un trazado con cambios de dirección en el centro de la ciudad.",
    reportedCondition: "Pavimento regular (simulado)",
    path: [[-12.052, -77.047], [-12.056, -77.042], [-12.061, -77.042], [-12.067, -77.037], [-12.072, -77.037]],
  },
  {
    id: "oeste",
    name: "Tramo Oeste",
    district: "Pueblo Libre",
    description: "Ejemplo de una conexión ficticia que recorre el mapa de oeste a este.",
    path: [[-12.082, -77.072], [-12.08, -77.062], [-12.084, -77.055], [-12.084, -77.047], [-12.09, -77.041]],
  },
  {
    id: "sur",
    name: "Tramo Sur",
    district: "San Isidro",
    description: "Ejemplo de un trazado ficticio en la parte sur del mapa.",
    path: [[-12.109, -77.055], [-12.109, -77.047], [-12.105, -77.039], [-12.106, -77.033], [-12.11, -77.027]],
  },
];
