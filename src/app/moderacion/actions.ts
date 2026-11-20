"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAccount } from "../../lib/supabase/account";

const review = z.object({ report_id: z.uuid(), decision: z.enum(["approved", "rejected"]) });

export async function reviewReport(_previous: string | null, form: FormData): Promise<string | null> {
  const account = await getAccount();
  if (!account) return "Inicia sesión para revisar reportes.";

  const parsed = review.safeParse(Object.fromEntries(form));
  if (!parsed.success) return "La decisión o el reporte no son válidos.";

  const { data, error } = await account.supabase.rpc("review_risk_report", parsed.data);
  if (error?.code === "42501") return "Solo los moderadores pueden revisar reportes.";
  if (error) return "No se pudo guardar la decisión. Inténtalo de nuevo.";
  if (data !== true) return "Este reporte ya fue revisado o no está disponible.";

  revalidatePath("/moderacion");
  return null;
}
