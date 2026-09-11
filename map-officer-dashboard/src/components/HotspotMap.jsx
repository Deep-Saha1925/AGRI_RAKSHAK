import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getOfficerCases, getHotspots, getClusterAlerts } from "../api/mockApi";

const riskColor = { HIGH: "#c0392b", MEDIUM: "#d98e04", LOW: "#3f7d2f" };
const MAHARASHTRA_CENTER = [19.75, 76.5];

export default function HotspotMap() {
  const [viewMode, setViewMode] = useState("hotspots"); // "hotspots" | "cases"
  const [cases, setCases] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getOfficerCases(), getHotspots(), getClusterAlerts()]).then(([c, h, a]) => {
      setCases(c);
      setHotspots(h);
      setAlerts(a);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-agri-green-800">Disease & Pest Hotspot Map</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("hotspots")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
              viewMode === "hotspots"
                ? "bg-agri-green-600 text-white border-agri-green-600"
                : "bg-white text-agri-green-700 border-agri-beige-400"
            }`}
          >
            Taluka Hotspots (GET /officer/hotspots/)
          </button>
          <button
            onClick={() => setViewMode("cases")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
              viewMode === "cases"
                ? "bg-agri-green-600 text-white border-agri-green-600"
                : "bg-white text-agri-green-700 border-agri-beige-400"
            }`}
          >
            Individual Cases (GET /officer/cases/)
          </button>
        </div>
      </div>

      {!loading && alerts.length > 0 && (
        <div className="bg-agri-amber/10 border border-agri-amber text-agri-green-900 rounded-xl px-4 py-2.5 mb-3 text-sm">
          <span className="font-semibold">⚠ Cluster Alerts:</span>{" "}
          {alerts.map((a, i) => (
            <span key={i}>
              {a.taluka} — {a.disease} ({a.count} cases){i < alerts.length - 1 ? " · " : ""}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div className="h-[520px] flex items-center justify-center bg-agri-beige-100 rounded-xl text-agri-green-600">
          Loading map data…
        </div>
      ) : (
        <MapContainer
          center={MAHARASHTRA_CENTER}
          zoom={7}
          style={{ height: "520px", width: "100%", borderRadius: "0.75rem" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {viewMode === "hotspots"
            ? hotspots.map((h) => (
                <CircleMarker
                  key={h.taluka}
                  center={[h.lat, h.lng]}
                  radius={10 + Math.min(h.count * 1.5, 14)}
                  pathOptions={{
                    color: riskColor[h.dominant_risk],
                    fillColor: riskColor[h.dominant_risk],
                    fillOpacity: 0.6,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <strong>{h.taluka}</strong>
                    <br />
                    {h.count} case{h.count > 1 ? "s" : ""}
                    <br />
                    Dominant issue: {h.dominant_disease}
                    <br />
                    Risk: {h.dominant_risk}
                  </Popup>
                </CircleMarker>
              ))
            : cases.map((c) => (
                <CircleMarker
                  key={c.diagnosis_id}
                  center={[c.lat, c.lng]}
                  radius={8}
                  pathOptions={{
                    color: riskColor[c.risk_level] || "#999",
                    fillColor: riskColor[c.risk_level] || "#999",
                    fillOpacity: 0.75,
                  }}
                >
                  <Popup>
                    <strong>{c.crop}</strong> — {c.disease}
                    <br />
                    Village: {c.village}, {c.taluka}
                    <br />
                    Confidence: {(c.confidence * 100).toFixed(0)}%
                    <br />
                    Status: {c.status}
                    <br />
                    Risk: {c.risk_level}
                  </Popup>
                </CircleMarker>
              ))}
        </MapContainer>
      )}

      <div className="mt-3 flex gap-4 text-sm text-agri-green-700">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: riskColor.HIGH }} /> High risk
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: riskColor.MEDIUM }} /> Medium risk
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: riskColor.LOW }} /> Low risk
        </span>
      </div>
    </div>
  );
}
