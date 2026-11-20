import type { CycleLane } from "./demo-lanes";

export function LaneDetails({ lane }: { lane: CycleLane }) {
  return (
    <article className="lane-details" aria-labelledby="selected-lane-name">
      <h3 id="selected-lane-name">{lane.name}</h3>
      <dl>
        <dt>Distrito de referencia</dt>
        <dd>{lane.district}</dd>
        <dt>Descripción</dt>
        <dd>{lane.description}</dd>
        <dt>Estado reportado</dt>
        <dd>{lane.reportedCondition ?? "Sin información verificada"}</dd>
      </dl>
    </article>
  );
}
