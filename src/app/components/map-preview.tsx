"use client";

import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";

export type Coordinates = [latitude: number, longitude: number];
export type MapPin = { position: Coordinates; label: string };
const emptyPins: MapPin[] = [];

export function MapPreview({ path, pins = emptyPins, label }: { path?: Coordinates[]; pins?: MapPin[]; label: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!container.current) return;
    const element = container.current;
    let disposed = false;
    let map: LeafletMap | undefined;
    let observer: ResizeObserver | undefined;

    void import("leaflet").then((leaflet) => {
      if (disposed) return;

      const view = leaflet.map(element, { preferCanvas: true, trackResize: false, scrollWheelZoom: false, zoomControl: false });
      map = view;
      leaflet.control.zoom({ zoomInTitle: "Acercar", zoomOutTitle: "Alejar" }).addTo(view);
      view.attributionControl.setPrefix(false);
      const bounds = leaflet.latLngBounds([]);
      if (path && path.length > 1) {
        const line = leaflet.polyline(path, { color: "#13634c", weight: 6, dashArray: "10 7" }).addTo(view);
        bounds.extend(line.getBounds());
        for (const point of [path[0], path[path.length - 1]]) {
          leaflet.circleMarker(point, { radius: 6, color: "#173a31", fillOpacity: 1, fillColor: "#d9ee83" }).addTo(view);
        }
      }

      const pinIcon = leaflet.divIcon({ className: "parking-pin", html: "P", iconSize: [26, 26] });
      for (const pin of pins) {
        const description = document.createElement("span");
        description.textContent = pin.label;
        leaflet.marker(pin.position, { icon: pinIcon, title: pin.label }).addTo(view).bindPopup(description);
        bounds.extend(pin.position);
      }
      if (bounds.isValid()) view.fitBounds(bounds, { padding: [30, 30], maxZoom: 14, animate: false });
      else view.setView([-12.076, -77.044], 12);

      let tileLoaded = false;
      leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        maxZoom: 19,
      }).on("loading", () => { tileLoaded = false; })
        .on("tileload", () => { tileLoaded = true; })
        .on("load", () => { if (!disposed) setNotice(tileLoaded ? "" : "Mapa base no disponible."); })
        .addTo(view);

      observer = new ResizeObserver(() => {
        if (!disposed && element.clientWidth && element.clientHeight) view.invalidateSize({ animate: false });
      });
      observer.observe(element);
    }).catch(() => { if (!disposed) setNotice("No se pudo abrir el mapa."); });

    return () => { disposed = true; observer?.disconnect(); map?.remove(); };
  }, [path, pins]);

  return (
    <section className="preview-map" aria-label={label}>
      <div className="leaflet-surface" ref={container} />
      {notice && <div role="status" className="map-notice">{notice}</div>}
    </section>
  );
}
