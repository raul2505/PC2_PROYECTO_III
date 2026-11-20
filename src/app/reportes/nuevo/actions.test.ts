import { beforeEach, expect, test, vi } from "vitest";
import { submitReport } from "./actions";

const mocks = vi.hoisted(() => ({ getAccount: vi.fn(), insert: vi.fn() }));
vi.mock("../../../lib/supabase/account", () => ({ getAccount: mocks.getAccount }));

function sampleReport() {
  const form = new FormData();
  form.set("type", "obstaculo");
  form.set("description", "Un obstáculo impide el paso.");
  form.set("latitude", "-12.05");
  form.set("longitude", "-77.04");
  return form;
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getAccount.mockResolvedValue({ supabase: { from: () => ({ insert: mocks.insert }) } });
  mocks.insert.mockResolvedValue({ error: null });
});

test("HU-05 envía solo los datos autorizados al registrar un reporte", async () => {
  const form = sampleReport();
  form.set("status", "approved");
  form.set("author_id", "otro-usuario");

  await expect(submitReport(null, form)).resolves.toEqual({ ok: true, message: "Reporte enviado. Quedó pendiente de revisión." });
  expect(mocks.insert).toHaveBeenCalledWith({ type: "obstaculo", description: "Un obstáculo impide el paso.", latitude: -12.05, longitude: -77.04 });
});

test("HU-05 rechaza un reporte sin sesión", async () => {
  mocks.getAccount.mockResolvedValueOnce(null);

  await expect(submitReport(null, sampleReport())).resolves.toMatchObject({ ok: false });
  expect(mocks.insert).not.toHaveBeenCalled();
});

test("HU-05 rechaza coordenadas en blanco", async () => {
  const form = sampleReport();
  form.set("latitude", "  ");

  await expect(submitReport(null, form)).resolves.toMatchObject({ ok: false });
  expect(mocks.insert).not.toHaveBeenCalled();
});
