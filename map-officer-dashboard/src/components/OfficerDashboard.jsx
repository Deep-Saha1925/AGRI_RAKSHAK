import { useEffect, useMemo, useState } from "react";
import { getOfficerCases, patchCase } from "../api/mockApi";

const riskColor = { HIGH: "text-agri-red", MEDIUM: "text-agri-amber", LOW: "text-agri-green-600" };

// Exact status enum from API_CONTRACT.md - do not invent new values here.
const STATUS_LABEL = {
  pending_review: "Pending Review",
  routed_farmer: "Routed to Farmer",
  routed_officer: "Routed to Officer",
  verified: "Verified",
};
const STATUS_COLOR = {
  pending_review: "bg-agri-amber/15 text-agri-amber",
  routed_farmer: "bg-agri-green-100 text-agri-green-700",
  routed_officer: "bg-agri-red/10 text-agri-red",
  verified: "bg-agri-green-600/15 text-agri-green-800",
};

export default function OfficerDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cropFilter, setCropFilter] = useState("All");
  const [diseaseFilter, setDiseaseFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [reviewing, setReviewing] = useState(null);

  async function refresh() {
    setLoading(true);
    const data = await getOfficerCases({
      crop: cropFilter,
      disease: diseaseFilter,
      risk: riskFilter,
    });
    setCases(data);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropFilter, diseaseFilter, riskFilter]);

  const [allCrops, setAllCrops] = useState([]);
  const [allDiseases, setAllDiseases] = useState([]);
  useEffect(() => {
    getOfficerCases().then((all) => {
      setAllCrops(["All", ...new Set(all.map((c) => c.crop))]);
      setAllDiseases(["All", ...new Set(all.map((c) => c.disease))]);
    });
  }, []);

  const pendingCount = useMemo(
    () => cases.filter((c) => c.status === "routed_officer" || c.status === "pending_review").length,
    [cases]
  );
  const highRiskCount = useMemo(() => cases.filter((c) => c.risk_level === "HIGH").length, [cases]);

  async function handleConfirm(diagnosisId) {
    await patchCase(diagnosisId, { action: "confirm" });
    refresh();
    setReviewing(null);
  }

  async function handleCorrect(diagnosisId, correctedDisease) {
    await patchCase(diagnosisId, { action: "correct", corrected_disease: correctedDisease });
    refresh();
    setReviewing(null);
  }

  return (
    <div>
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
        <h2 className="text-xl font-bold text-agri-green-800">Officer Dashboard</h2>
        <p className="text-sm text-agri-green-600">
          {pendingCount} awaiting review · {highRiskCount} high-risk · {cases.length} shown
        </p>
      </div>

      {/* Filters - map to GET /officer/cases/?crop=&disease=&risk= */}
      <div className="flex flex-wrap gap-3 items-center bg-white border border-agri-beige-300 rounded-xl px-4 py-3 mb-4">
        <FilterSelect label="Crop" value={cropFilter} options={allCrops} onChange={setCropFilter} />
        <FilterSelect label="Disease" value={diseaseFilter} options={allDiseases} onChange={setDiseaseFilter} />
        <FilterSelect label="Risk" value={riskFilter} options={["All", "HIGH", "MEDIUM", "LOW"]} onChange={setRiskFilter} />
      </div>

      <div className="bg-white border border-agri-beige-300 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-agri-beige-100 text-left text-agri-green-800">
              <th className="px-4 py-2.5 font-semibold">Village / Taluka</th>
              <th className="px-4 py-2.5 font-semibold">Crop</th>
              <th className="px-4 py-2.5 font-semibold">Disease (AI)</th>
              <th className="px-4 py-2.5 font-semibold">Confidence</th>
              <th className="px-4 py-2.5 font-semibold">Risk</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-agri-green-500">Loading…</td></tr>
            ) : cases.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-agri-green-500">No cases match these filters.</td></tr>
            ) : (
              cases.map((c) => (
                <tr key={c.diagnosis_id} className="border-t border-agri-beige-200">
                  <td className="px-4 py-2.5">{c.village}, {c.taluka}</td>
                  <td className="px-4 py-2.5 capitalize">{c.crop}</td>
                  <td className="px-4 py-2.5">{c.disease}</td>
                  <td className="px-4 py-2.5">{(c.confidence * 100).toFixed(0)}%</td>
                  <td className={`px-4 py-2.5 font-semibold ${riskColor[c.risk_level] || ""}`}>{c.risk_level}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[c.status]}`}>
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => setReviewing(c)}
                      className="text-agri-green-700 font-medium hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {reviewing && (
        <ReviewModal
          caseData={reviewing}
          allDiseases={allDiseases.filter((d) => d !== "All")}
          onClose={() => setReviewing(null)}
          onConfirm={handleConfirm}
          onCorrect={handleCorrect}
        />
      )}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="text-sm text-agri-green-800 flex items-center gap-2">
      {label}:
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-agri-beige-400 bg-agri-beige-50 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green-400"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function ReviewModal({ caseData, allDiseases, onClose, onConfirm, onCorrect }) {
  const [mode, setMode] = useState(null);
  const [correctedDisease, setCorrectedDisease] = useState(caseData.disease);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-agri-green-800 mb-2">Review Case</h3>
        <div className="text-sm text-agri-green-700 space-y-1 mb-4">
          <p><span className="font-medium">Location:</span> {caseData.village}, {caseData.taluka}</p>
          <p><span className="font-medium">Crop:</span> {caseData.crop}</p>
          <p><span className="font-medium">AI Diagnosis:</span> {caseData.disease} ({(caseData.confidence * 100).toFixed(0)}% confidence)</p>
          <p><span className="font-medium">Risk level:</span> {caseData.risk_level}</p>
        </div>

        {mode !== "correcting" ? (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onConfirm(caseData.diagnosis_id)}
              className="bg-agri-green-600 hover:bg-agri-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Confirm AI diagnosis
            </button>
            <button
              onClick={() => setMode("correcting")}
              className="bg-agri-amber hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Correct diagnosis
            </button>
            <button onClick={onClose} className="ml-auto text-sm text-agri-green-600 hover:underline">
              Cancel
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-sm text-agri-green-800">
              Correct disease
              <select
                value={correctedDisease}
                onChange={(e) => setCorrectedDisease(e.target.value)}
                className="w-full mt-1 rounded-lg border border-agri-beige-400 bg-agri-beige-50 px-3 py-2 text-sm"
              >
                {allDiseases.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onCorrect(caseData.diagnosis_id, correctedDisease)}
                className="bg-agri-blue text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                Save correction
              </button>
              <button onClick={() => setMode(null)} className="text-sm text-agri-green-600">
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
