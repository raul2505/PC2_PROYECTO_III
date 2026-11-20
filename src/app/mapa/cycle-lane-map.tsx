"use client";

import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";
import type { CycleLane } from "./demo-lanes";

type Status = "loading" | "ready" | "error";

export function CycleLaneMap({ lanes }: { lanes: readonly CycleLane[] }) {
  const container = useRef<HTMLDivElement>(null);
  const resetView = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [baseUnavailable, setBaseUnavailable] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!container.current) return;

    const element = container.current;
    let active = true;
    let map: LeafletMap | undefined;

    void import("leaflet").then((leaflet) => {
      if (!active) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const view = leaflet.map(element, {
        preferCanvas: true,
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

      const lines = leaflet.featureGroup(lanes.map(({ path }) => leaflet.polyline(path, {
        color: "#13634c",
        weight: 5,
        opacity: 1,
        dashArray: "10 7",
        interactive: false,
      }))).addTo(view);

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
      resetView.current = null;
      setStatus("error");
    });

    return () => {
      active = false;
      map?.remove();
      resetView.current = null;
    };
  }, [attempt, lanes]);

  function retry() {
    setStatus("loading");
    setBaseUnavailable(false);
    setAttempt((previous) => previous + 1);
  }

  return (
    <section className="map-frame" aria-label="Mapa interactivo de Lima" aria-describedby="map-scope">
      <div className="map-toolbar">
        <p role="status">{lanes.length === 0 ? "No hay ciclovías para mostrar" : `${lanes.length} ${lanes.length === 1 ? "trazado" : "trazados"} de muestra`}</p>
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
  );
}
