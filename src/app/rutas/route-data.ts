import { demoLanes } from "../mapa/demo-lanes";

export const routePoints = demoLanes.flatMap((lane) => [
  { id: `${lane.id}-inicio`, label: `${lane.name} · inicio`, laneId: lane.id, index: 0 },
  { id: `${lane.id}-fin`, label: `${lane.name} · fin`, laneId: lane.id, index: lane.path.length - 1 },
]);

type QueryValue = string | string[] | undefined;

export function readRouteSelection(origin: QueryValue, destination: QueryValue) {
  const from = routePoints.find((point) => point.id === origin);
  const to = routePoints.find((point) => point.id === destination);
  const requested = origin !== undefined || destination !== undefined;

  return { from, to, requested, valid: !!from && !!to && from.id !== to.id };
}

export function findDemoRoute(selection: ReturnType<typeof readRouteSelection>) {
  const { from, to, valid } = selection;
  if (!valid || !from || !to || from.laneId !== to.laneId) return null;

  const lane = demoLanes.find((item) => item.id === from.laneId);
  if (!lane) return null;

  const path = lane.path.slice(Math.min(from.index, to.index), Math.max(from.index, to.index) + 1);
  if (from.index > to.index) path.reverse();
  return { name: lane.name, from: from.label, to: to.label, path };
}
