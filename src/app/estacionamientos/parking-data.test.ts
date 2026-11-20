import { expect, test } from "vitest";
import { filterParkings } from "./parking-data";

test("HU-12 filtra estaciones por un distrito disponible", () => {
  expect(filterParkings("Pueblo Libre").items.map(({ id }) => id)).toEqual(["oeste"]);
});

test("HU-12 distingue un distrito sin resultados de una consulta inválida", () => {
  expect(filterParkings("Miraflores")).toMatchObject({ items: [], valid: true });
  expect(filterParkings(["Miraflores", "San Isidro"])).toMatchObject({ items: [], valid: false });
  expect(filterParkings("").items).toHaveLength(3);
});
