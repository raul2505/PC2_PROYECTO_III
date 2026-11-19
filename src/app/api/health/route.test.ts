import { expect, test } from "vitest";
import { GET } from "./route";

test("responde con el estado de la aplicación y evita caché", async () => {
  const response = GET();

  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(await response.json()).toEqual({ status: "ok" });
});
