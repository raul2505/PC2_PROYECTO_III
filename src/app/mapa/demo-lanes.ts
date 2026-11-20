type Coordinates = [latitude: number, longitude: number];

export type CycleLane = { path: Coordinates[] };

// Geometrías ficticias para probar el mapa. No representan infraestructura vial.
export const demoLanes: CycleLane[] = [
  { path: [[-12.052, -77.047], [-12.056, -77.042], [-12.061, -77.042], [-12.067, -77.037], [-12.072, -77.037]] },
  { path: [[-12.082, -77.072], [-12.08, -77.062], [-12.084, -77.055], [-12.084, -77.047], [-12.09, -77.041]] },
  { path: [[-12.109, -77.055], [-12.109, -77.047], [-12.105, -77.039], [-12.106, -77.033], [-12.11, -77.027]] },
];
