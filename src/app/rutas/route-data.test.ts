import { expect, test } from "vitest";
import { findDemoRoute, readRouteSelection } from "./route-data";

test("HU-08 acepta dos puntos de demostración distintos", () => {
  expect(readRouteSelection("centro-inicio", "centro-fin")).toMatchObject({ requested: true, valid: true });
});

test("HU-09 usa la geometría del catálogo y respeta el sentido solicitado", () => {
  const outbound = findDemoRoute(readRouteSelection("centro-inicio", "centro-fin"));
  const inbound = findDemoRoute(readRouteSelection("centro-fin", "centro-inicio"));
  expect(outbound?.path.length).toBeGreaterThan(2);
  expect(inbound?.path).toEqual(outbound?.path.toReversed());
});

test("HU-09 informa que no hay recorrido entre tramos desconectados", () => {
  expect(findDemoRoute(readRouteSelection("centro-inicio", "oeste-fin"))).toBeNull();
});

test("HU-08 distingue una visita inicial de una selección incompleta o desconocida", () => {
  expect(readRouteSelection(undefined, undefined).requested).toBe(false);
  expect(readRouteSelection("centro-inicio", undefined).valid).toBe(false);
  expect(readRouteSelection("centro-inicio", "desconocido").valid).toBe(false);
  expect(readRouteSelection("centro-inicio", "centro-inicio").valid).toBe(false);
  expect(readRouteSelection(["centro-inicio", "sur-inicio"], "centro-fin").valid).toBe(false);
});
