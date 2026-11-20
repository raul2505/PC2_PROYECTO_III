import { expect, test } from "vitest";
import { riskAlertSchema } from "./risk-alerts";

test("HU-06 reduce el aviso a los campos públicos de cartografía", () => {
  const alert = riskAlertSchema.parse({ id: "1b943674-1478-4220-a832-01e98f362610", type: "obstaculo", latitude: -12.053, longitude: -77.041, created_at: "2026-11-20T06:00:00+00:00", description: "privado", author_id: "privado" });
  expect(Object.keys(alert)).toEqual(["id", "type", "latitude", "longitude", "created_at"]);
});
