import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { CycleLaneMap } from "./cycle-lane-map";
import { demoLanes } from "./demo-lanes";
import { LaneDetails } from "./lane-details";

describe("HU-01 · mapa público", () => {
  test("anuncia la carga y presenta el catálogo como demostración", () => {
    const html = renderToStaticMarkup(<CycleLaneMap lanes={demoLanes} />);

    expect(html).toContain("Cargando el mapa");
    expect(html).toContain(`${demoLanes.length} trazados de muestra`);
    expect(html).toContain('aria-busy="true"');
  });

  test("informa cuando el catálogo está vacío", () => {
    const html = renderToStaticMarkup(<CycleLaneMap lanes={[]} />);

    expect(html).toContain("No hay ciclovías para mostrar");
    expect(html).not.toContain("trazados de muestra");
  });
});

describe("HU-02 · ficha de tramo", () => {
  test("muestra el distrito, la descripción y el estado reportado cuando existe", () => {
    const [lane] = demoLanes;
    const html = renderToStaticMarkup(<LaneDetails lane={lane} />);

    expect(html).toContain(lane.name);
    expect(html).toContain(lane.district);
    expect(html).toContain(lane.description);
    expect(html).toContain("Pavimento regular (simulado)");
  });

  test("informa cuando no hay un estado verificado", () => {
    const [, lane] = demoLanes;
    const html = renderToStaticMarkup(<LaneDetails lane={lane} />);

    expect(html).toContain("Sin información verificada");
    expect(html).not.toContain("Pavimento regular");
  });
});
