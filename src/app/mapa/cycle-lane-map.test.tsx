import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { CycleLaneMap } from "./cycle-lane-map";
import { demoLanes } from "./demo-lanes";

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
