import { expect, test } from "vitest";
import { readRouteSelection } from "./route-data";

test("HU-08 acepta dos puntos de demostración distintos", () => {
  expect(readRouteSelection("centro-inicio", "centro-fin")).toMatchObject({ requested: true, valid: true });
});

test("HU-08 distingue una visita inicial de una selección incompleta o desconocida", () => {
  expect(readRouteSelection(undefined, undefined).requested).toBe(false);
  expect(readRouteSelection("centro-inicio", undefined).valid).toBe(false);
  expect(readRouteSelection("centro-inicio", "desconocido").valid).toBe(false);
  expect(readRouteSelection("centro-inicio", "centro-inicio").valid).toBe(false);
  expect(readRouteSelection(["centro-inicio", "sur-inicio"], "centro-fin").valid).toBe(false);
});
