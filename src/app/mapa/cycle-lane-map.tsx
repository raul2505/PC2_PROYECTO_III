"use client";

import type { FeatureGroup, Map as LeafletMap, Polyline } from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import { filterLanesByDistrict, type CycleLane } from "./demo-lanes";
import { LaneDetails } from "./lane-details";

type Status = "loading" | "ready" | "error";

export function CycleLaneMap({ lanes, districts }: { lanes: readonly CycleLane[]; districts: readonly string[] }) {
  const container = useRef<HTMLDivElement>(null);
  const districtSelect = useRef<HTMLSelectElement>(null);
  const detailPanel = useRef<HTMLDivElement>(null);
  const paths = useRef(new Map<string, Polyline>());
  const mapLayers = useRef<FeatureGroup | null>(null);
  const resetView = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [baseUnavailable, setBaseUnavailable] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [district, setDistrict] = useState("");
  const [selectedId, setSelectedId] = useState<string>();
  const visibleLanes = useMemo(() => filterLanesByDistrict(lanes, district), [lanes, district]);
  const selectedLane = visibleLanes.find(({ id }) => id === selectedId);
  const resultCount = visibleLanes.length;
  const emptyMessage = district ? `No hay ciclovías de muestra en ${district}.` : "No hay ciclovías para mostrar";

  useEffect(() => {
    if (!container.current) return;

    const element = container.current;
    const lanePaths = paths.current;
    let active = true;
    let map: LeafletMap | undefined;

    void import("leaflet").then((leaflet) => {
      if (!active) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const view = leaflet.map(element, {
        renderer: leaflet.canvas({ tolerance: 8 }),
        scrollWheelZoom: false,
        zoomControl: false,
        zoomAnimation: !reduceMotion,
        fadeAnimation: !reduceMotion,
      });
      map = view;
      leaflet.control.zoom({
        position: "bottomright",
        zoomInTitle: "Acercar",
        zoomOutTitle: "Alejar",
      }).addTo(view);
      view.attributionControl.setPrefix(false);

      const lines = leaflet.featureGroup(lanes.map(({ id, path }) => {
        const line = leaflet.polyline(path, {
          color: "#13634c",
          weight: 5,
          dashArray: "10 7",
        });
        line.on("click", () => setSelectedId(id));
        lanePaths.set(id, line);
        return line;
      })).addTo(view);
      mapLayers.current = lines;

      resetView.current = () => {
        const bounds = lines.getBounds();
        if (bounds.isValid()) {
          view.fitBounds(bounds, { maxZoom: 13, padding: [38, 38], animate: false });
        } else {
          view.setView([-12.076, -77.044], 12, { animate: false });
        }
      };
      resetView.current();

      let hasTile = false;
      const base = leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        maxZoom: 19,
      });
      base.on("loading", () => { hasTile = false; });
      base.on("tileload", () => { hasTile = true; });
      base.on("load", () => {
        if (active) setBaseUnavailable(!hasTile);
      });
      base.addTo(view);
      setStatus("ready");
    }).catch(() => {
      if (!active) return;
      map?.remove();
      map = undefined;
      lanePaths.clear();
      mapLayers.current = null;
      resetView.current = null;
      setStatus("error");
    });

    return () => {
      active = false;
      map?.remove();
      lanePaths.clear();
      mapLayers.current = null;
      resetView.current = null;
    };
  }, [attempt, lanes]);

  useEffect(() => {
    const group = mapLayers.current;
    if (!group) return;

    const visibleIds = new Set(visibleLanes.map(({ id }) => id));
    let layersChanged = false;

    for (const [id, line] of paths.current) {
      const visible = visibleIds.has(id);
      if (group.hasLayer(line) !== visible) {
        if (visible) group.addLayer(line);
        else group.removeLayer(line);
        layersChanged = true;
      }
      if (!visible) continue;
      const selected = id === selectedId;
      line.setStyle({ color: selected ? "#173a31" : "#13634c", weight: selected ? 8 : 5 });
      if (selected) line.bringToFront();
    }
    if (layersChanged && visibleLanes.length > 0) resetView.current?.();
  }, [selectedId, status, visibleLanes]);

  useEffect(() => {
    if (selectedId && window.matchMedia("(max-width: 48rem)").matches) {
      detailPanel.current?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedId]);

  function retry() {
    setStatus("loading");
    setBaseUnavailable(false);
    setAttempt((previous) => previous + 1);
  }

  function changeDistrict(nextDistrict: string) {
    setDistrict(nextDistrict);
    if (nextDistrict && selectedLane?.district !== nextDistrict) setSelectedId(undefined);
  }

  return (
    <div className="atlas-content">
      <aside className="map-guide" aria-labelledby="map-heading">
        <div>
          <h1 id="map-heading">Mapa de <span>ciclovías</span></h1>
          <p>Selecciona un trazado en el mapa o en la lista para consultar su ficha.</p>
        </div>

        <div className="district-filter">
          <label htmlFor="cycle-lane-district">Distrito</label>
          <select ref={districtSelect} id="cycle-lane-district" value={district} onChange={(event) => changeDistrict(event.target.value)}>
            <option value="">Todos los distritos</option>
            {districts.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        {resultCount > 0 && (
          <section className="lane-browser" aria-labelledby="lane-list-heading">
            <h2 id="lane-list-heading">Tramos</h2>
            <ul className="lane-list">
              {visibleLanes.map((lane) => (
                <li key={lane.id}>
                  <button type="button" aria-pressed={selectedId === lane.id} onClick={() => setSelectedId(lane.id)}>
                    {lane.name}
                  </button>
                </li>
              ))}
            </ul>
            <div ref={detailPanel} aria-live="polite" aria-atomic="true">
              {selectedLane && <LaneDetails lane={selectedLane} />}
            </div>
          </section>
        )}

        {district && resultCount === 0 && (
          <button type="button" className="district-reset" onClick={() => {
            changeDistrict("");
            districtSelect.current?.focus();
          }}>
            Ver todos los distritos
          </button>
        )}

        <div className="map-legend">
          <span className="legend-line" aria-hidden="true" />
          <div>
            <strong>Trazados de demostración</strong>
            <p id="map-scope">Geometrías y fichas ficticias. No las uses para planificar un viaje.</p>
          </div>
        </div>
      </aside>

      <section className="map-frame" aria-label="Mapa interactivo de Lima" aria-describedby="map-scope">
        <div className="map-toolbar">
          <p role="status">{resultCount === 0 ? emptyMessage : `${resultCount} ${resultCount === 1 ? "trazado" : "trazados"} de muestra`}</p>
          <button type="button" disabled={status !== "ready"} onClick={() => resetView.current?.()}>
            Vista inicial
          </button>
        </div>

        <div className="map-stage" aria-busy={status === "loading"}>
          <div ref={container} className="leaflet-surface" aria-label="Cartografía de Lima" />
          {status === "loading" && (
            <p className="map-notice" role="status">Cargando el mapa…</p>
          )}
          {status === "error" && (
            <div className="map-notice" role="alert">
              <p>No se pudo iniciar el mapa.</p>
              <button type="button" onClick={retry}>Reintentar</button>
            </div>
          )}
          {status === "ready" && baseUnavailable && (
            <p className="map-notice" role="status">Mapa base no disponible. Comprueba tu conexión y recarga la página.</p>
          )}
        </div>
      </section>
    </div>
  );
}
