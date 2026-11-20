import { beforeEach, expect, test, vi } from "vitest";
import { signIn, signOut } from "./actions";

const mocks = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  getSupabaseConfig: vi.fn(),
  redirect: vi.fn((path: string): never => { throw new Error(`redirect ${path}`); }),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("../../lib/supabase/config", () => ({ getSupabaseConfig: mocks.getSupabaseConfig }));
vi.mock("../../lib/supabase/server", () => ({
  createClient: async () => ({ auth: { signInWithPassword: mocks.signInWithPassword, signOut: mocks.signOut } }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getSupabaseConfig.mockReturnValue({ url: "https://demo.example", key: "sb_publishable_demo" });
});

function loginForm(email = "ciclista@example.com", password = "clave-de-prueba") {
  const form = new FormData();
  form.set("email", email);
  form.set("password", password);
  return form;
}

test("HU-04 redirige a la cuenta si Supabase confirma la sesión", async () => {
  mocks.signInWithPassword.mockResolvedValueOnce({ data: { session: {} }, error: null });

  await expect(signIn(null, loginForm(" ciclista@example.com "))).rejects.toThrow("redirect /cuenta");
  expect(mocks.signInWithPassword).toHaveBeenCalledWith({ email: "ciclista@example.com", password: "clave-de-prueba" });
});

test("HU-04 deniega credenciales incorrectas sin exponer el error del proveedor", async () => {
  mocks.signInWithPassword.mockResolvedValueOnce({ data: { session: null }, error: { status: 400, message: "detalle interno" } });

  await expect(signIn(null, loginForm())).resolves.toBe("No se pudo iniciar sesión. Revisa tu correo y contraseña.");
  expect(mocks.redirect).not.toHaveBeenCalled();
});

test("HU-04 valida el formulario antes de enviar credenciales", async () => {
  await expect(signIn(null, loginForm("correo inválido", ""))).resolves.toBe("Ingresa un correo válido y tu contraseña.");
  expect(mocks.signInWithPassword).not.toHaveBeenCalled();
});

test("HU-04 informa que el acceso está indisponible si falta la configuración", async () => {
  mocks.getSupabaseConfig.mockReturnValueOnce(null);

  await expect(signIn(null, loginForm())).resolves.toMatch(/no está disponible/);
  expect(mocks.signInWithPassword).not.toHaveBeenCalled();
});

test("HU-04 cierra la sesión de este navegador", async () => {
  mocks.signOut.mockResolvedValueOnce({ error: null });

  await expect(signOut()).rejects.toThrow("redirect /acceso");
  expect(mocks.signOut).toHaveBeenCalledWith({ scope: "local" });
});
