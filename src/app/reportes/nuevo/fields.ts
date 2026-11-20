import { z } from "zod";

export const riskTypes = {
  obstaculo: "Obstáculo",
  infraestructura: "Infraestructura dañada",
  iluminacion: "Iluminación deficiente",
  otro: "Otro riesgo",
} as const;

const coordinate = (min: number, max: number) => z.string().trim().min(1).pipe(z.coerce.number<string>().min(min).max(max));

export const reportFields = z.object({
  type: z.enum(Object.keys(riskTypes) as (keyof typeof riskTypes)[]),
  description: z.string().trim().min(10).max(500),
  latitude: coordinate(-90, 90),
  longitude: coordinate(-180, 180),
});
