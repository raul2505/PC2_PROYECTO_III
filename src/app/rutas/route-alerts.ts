import type { RiskAlert } from "../../lib/risk-alerts";
import type { Coordinates } from "../components/map-preview";

const metersPerDegree = 111_320;
export const alertDistanceMeters = 200;

export function alertsNearRoute(alerts: readonly RiskAlert[], path: Coordinates[]) {
  const segments = path.slice(1).map((point, index) => [path[index], point] as const);

  return alerts.filter((alert) => {
    const longitudeScale = Math.cos(alert.latitude * Math.PI / 180) * metersPerDegree;
    return segments.some(([a, b]) => {
      const x = (a[1] - alert.longitude) * longitudeScale;
      const y = (a[0] - alert.latitude) * metersPerDegree;
      const dx = (b[1] - a[1]) * longitudeScale;
      const dy = (b[0] - a[0]) * metersPerDegree;
      const lengthSquared = dx * dx + dy * dy;
      const t = lengthSquared === 0 ? 0 : Math.min(1, Math.max(0, -(x * dx + y * dy) / lengthSquared));
      return Math.hypot(x + t * dx, y + t * dy) <= alertDistanceMeters;
    });
  });
}
