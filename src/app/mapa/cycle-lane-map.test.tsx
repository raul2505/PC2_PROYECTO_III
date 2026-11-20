import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { CycleLaneMap } from "./cycle-lane-map";
import { demoDistricts, demoLanes, filterLanesByDistrict } from "./demo-lanes";
import { LaneDetails } from "./lane-details";

describe("HU-01 · mapa público", () => {
  test("anuncia la carga y presenta el catálogo como demostración", () => {
    const html = renderToStaticMarkup(<CycleLaneMap lanes={demoLanes} districts={demoDistricts} />);

    expect(html).toContain("Cargando el mapa");
    expect(html).toContain(`${demoLanes.length} trazados de muestra`);
    expect(html).toContain('aria-busy="true"');
  });

  test("informa cuando el catálogo está vacío", () => {
    const html = renderToStaticMarkup(<CycleLaneMap lanes={[]} districts={demoDistricts} />);

    expect(html).toContain("No hay ciclovías para mostrar");
    expect(html).not.toContain("trazados de muestra");
  });
});

describe("HU-03 · filtro por distrito", () => {
  test("devuelve solo los tramos asociados al distrito seleccionado", () => {
    expect(filterLanesByDistrict(demoLanes, "Pueblo Libre").map(({ id }) => id)).toEqual(["oeste"]);
  });

  test("permite elegir un distrito sin cobertura de demostración", () => {
    const html = renderToStaticMarkup(<CycleLaneMap lanes={demoLanes} districts={demoDistricts} />);

    expect(html).toContain('<option value="Miraflores">Miraflores</option>');
    expect(filterLanesByDistrict(demoLanes, "Miraflores")).toEqual([]);
  });

  test("recupera el catálogo completo al elegir todos los distritos", () => {
    expect(filterLanesByDistrict(demoLanes, "")).toEqual(demoLanes);
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
