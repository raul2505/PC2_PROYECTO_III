import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { riskAlertSchema, type PublicAlerts } from "../risk-alerts";
import { getSupabaseConfig } from "./config";

export async function listPublicAlerts(): Promise<PublicAlerts> {
  const config = getSupabaseConfig();
  if (!config) return { available: false, items: [] };

  const supabase = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("list_public_risk_reports").abortSignal(AbortSignal.timeout(4000));
  if (error) return { available: false, items: [] };

  const parsed = z.array(riskAlertSchema).safeParse(data);
  return parsed.success ? { available: true, items: parsed.data } : { available: false, items: [] };
}
