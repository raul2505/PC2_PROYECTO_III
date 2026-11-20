"use server";

import { getAccount } from "../../../lib/supabase/account";
import { reportFields } from "./fields";

type Result = { ok: boolean; message: string };

export async function submitReport(_previous: Result | null, form: FormData): Promise<Result> {
  const account = await getAccount();
  if (!account) return { ok: false, message: "Inicia sesión para enviar un reporte." };

  const parsed = reportFields.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: "Revisa el tipo, la descripción y las coordenadas." };

  const { error } = await account.supabase.from("risk_reports").insert(parsed.data);
  if (error) return { ok: false, message: "No se pudo guardar el reporte. Inténtalo más tarde." };

  return { ok: true, message: "Reporte enviado. Quedó pendiente de revisión." };
}
