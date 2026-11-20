"use client";

import { useActionState, useState } from "react";
import { submitReport } from "./actions";
import { riskTypes } from "./fields";

export function ReportForm() {
  const [result, action, pending] = useActionState(submitReport, null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  function locate() {
    setLocationMessage("Buscando ubicación…");
    if (!navigator.geolocation) {
      setLocationMessage("Ingresa las coordenadas manualmente.");
      return;
    }
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setLatitude(coords.latitude.toFixed(6));
      setLongitude(coords.longitude.toFixed(6));
      setLocationMessage("Ubicación incorporada.");
    }, () => setLocationMessage("La ubicación no está disponible. Ingresa las coordenadas manualmente."), { timeout: 8000 });
  }

  return (
    <form className="auth-form" action={action}>
      <div className="auth-field">
        <label htmlFor="risk-type">Tipo de riesgo</label>
        <select id="risk-type" name="type" defaultValue="" required>
          <option value="" disabled>Selecciona un tipo</option>
          {Object.entries(riskTypes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </div>
      <div className="auth-field">
        <label htmlFor="risk-description">Descripción</label>
        <textarea id="risk-description" name="description" rows={3} minLength={10} maxLength={500} required />
      </div>
      <div className="coordinate-fields">
        <div className="auth-field"><label htmlFor="risk-latitude">Latitud</label><input id="risk-latitude" name="latitude" type="number" step="any" min={-90} max={90} value={latitude} onChange={(event) => setLatitude(event.target.value)} required /></div>
        <div className="auth-field"><label htmlFor="risk-longitude">Longitud</label><input id="risk-longitude" name="longitude" type="number" step="any" min={-180} max={180} value={longitude} onChange={(event) => setLongitude(event.target.value)} required /></div>
      </div>
      <button className="auth-secondary" type="button" onClick={locate}>Usar mi ubicación</button>
      {locationMessage && <p role="status">{locationMessage}</p>}
      {result && <p className={result.ok ? undefined : "auth-error"} role={result.ok ? "status" : "alert"}>{result.message}</p>}
      <button className="auth-button" type="submit" disabled={pending}>{pending ? "Enviando…" : "Enviar reporte"}</button>
    </form>
  );
}
