import { expect, test } from "vitest";
import { filterParkings, findParking, parkingConditions } from "./parking-data";

test("HU-12 filtra estaciones por un distrito disponible", () => {
  expect(filterParkings("Pueblo Libre").items.map(({ id }) => id)).toEqual(["oeste"]);
});

test("HU-13 conserva las condiciones de muestra e informa los datos desconocidos", () => {
  const parking = findParking("centro");
  expect(parking).toBeDefined();
  if (!parking) throw new Error("Falta el estacionamiento de muestra");
  expect(parkingConditions(parking)).toContainEqual(["Horario", "07:00–18:00 (simulado)"]);
  expect(parkingConditions(parking)).toContainEqual(["Vigilancia", "Por confirmar"]);
  expect(parkingConditions(parking)).toContainEqual(["Disponibilidad", "Por confirmar"]);
  expect(findParking("desconocido")).toBeUndefined();
});

test("HU-12 distingue un distrito sin resultados de una consulta inválida", () => {
  expect(filterParkings("Miraflores")).toMatchObject({ items: [], valid: true });
  expect(filterParkings(["Miraflores", "San Isidro"])).toMatchObject({ items: [], valid: false });
  expect(filterParkings("").items).toHaveLength(3);
});
