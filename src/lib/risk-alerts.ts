import { z } from "zod";

export const riskAlertSchema = z.object({
  id: z.uuid(),
  type: z.enum(["obstaculo", "infraestructura", "iluminacion", "otro"]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  created_at: z.iso.datetime({ offset: true }),
});

export type RiskAlert = z.infer<typeof riskAlertSchema>;
export type PublicAlerts = { available: boolean; items: RiskAlert[] };

const alertDate = new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeZone: "America/Lima" });

export function formatAlertDate(value: string) {
  return alertDate.format(new Date(value));
}
