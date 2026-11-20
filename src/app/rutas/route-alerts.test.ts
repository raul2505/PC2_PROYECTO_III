import { expect, test } from "vitest";
import type { RiskAlert } from "../../lib/risk-alerts";
import { alertsNearRoute } from "./route-alerts";

test("HU-10 relaciona alertas cercanas al tramo completo y descarta las lejanas", () => {
  const near: RiskAlert = { id: "near", type: "obstaculo", latitude: -12.001, longitude: -77.005, created_at: "2026-11-20T06:00:00Z" };
  const far = { ...near, id: "far", latitude: -12.01 };
  expect(alertsNearRoute([near, far], [[-12, -77], [-12, -77.01]])).toEqual([near]);
  expect(alertsNearRoute([far], [[-12, -77], [-12, -77.01]])).toEqual([]);
});
