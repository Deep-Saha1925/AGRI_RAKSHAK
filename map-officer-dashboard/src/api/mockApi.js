// Mock API layer for Person 5 (Maps + Officer Dashboard).
//
// This file exists so every component talks to functions shaped exactly like
// the real endpoints in API_CONTRACT.md. When Person 3's backend is live,
// replace the bodies of these functions with real `fetch(BASE_URL + path)`
// calls — the function names and return shapes should not need to change.
//
// BASE_URL per contract: http://localhost:8000/api/
// Auth: JWT Bearer token on every endpoint except /auth/*

import fieldsData from "../data/fields.json";
import risksData from "../data/risks.json";
import diagnosesData from "../data/diagnoses.json";

const MOCK_DELAY_MS = 300;

// In-memory mutable copies so PATCH/POST calls behave like a real backend
// for the duration of the session (resets on page reload).
let fields = [...fieldsData];
let risks = [...risksData];
let diagnoses = [...diagnosesData];

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

// Demo officer accounts. Contract: POST /auth/register/ takes
// { role, name, phone, password, language }. We pre-seed a couple of
// officer accounts so login (POST /auth/login/) has something to check against.
const DEMO_OFFICERS = [
  { id: 1, phone: "9876500001", password: "demo123", role: "officer", name: "Suresh Patil", language: "mr" },
  { id: 2, phone: "9876500002", password: "demo123", role: "officer", name: "Anjali Deshmukh", language: "mr" },
];

// ---------------- 1. Auth & Profiles ----------------

// POST /auth/login/  { phone, password } -> { access, refresh, role }
export async function login(phone, password) {
  const officer = DEMO_OFFICERS.find((o) => o.phone === phone && o.password === password);
  if (!officer) {
    throw new Error("Invalid phone or password.");
  }
  return delay({
    access: `mock-access-token-${officer.id}`,
    refresh: `mock-refresh-token-${officer.id}`,
    role: officer.role,
    // extra field for convenience in the mock only - a real client would call
    // GET /auth/me/ separately using the access token.
    _officer: officer,
  });
}

// GET /auth/me/  -> { id, name, role, language, phone }
export async function getMe(accessToken) {
  const officer = DEMO_OFFICERS.find((o) => `mock-access-token-${o.id}` === accessToken);
  if (!officer) throw new Error("Invalid or expired token.");
  const { id, name, role, language, phone } = officer;
  return delay({ id, name, role, language, phone });
}

// ---------------- 5. Officer Verification ----------------

// GET /officer/cases/?crop=&disease=&risk=
// Contract's raw shape is diagnosis-only (diagnosis_id, field_id, lat, lng,
// disease, confidence, status). A real backend join would enrich this with
// crop/village/taluka/risk for convenience - we do that join here in the mock
// to match what the UI needs, since Person 3's actual response shape for the
// *enriched* list isn't pinned down in the contract yet. CONFIRM with Person 3
// whether /officer/cases/ returns pre-joined data or just raw diagnosis rows.
export async function getOfficerCases(filters = {}) {
  let results = diagnoses.map((d) => {
    const field = fields.find((f) => f.field_id === d.field_id);
    const risk = risks.find((r) => r.field_id === d.field_id);
    return {
      ...d,
      crop: field?.crop,
      village: field?.village,
      taluka: field?.taluka,
      district: field?.district,
      risk_level: risk?.risk_level,
      risk_score: risk?.risk_score,
    };
  });

  if (filters.crop && filters.crop !== "All") {
    results = results.filter((r) => r.crop === filters.crop);
  }
  if (filters.disease && filters.disease !== "All") {
    results = results.filter((r) => r.disease === filters.disease);
  }
  if (filters.risk && filters.risk !== "All") {
    results = results.filter((r) => r.risk_level === filters.risk);
  }

  return delay(results);
}

// GET /officer/hotspots/ -> aggregated village/taluka-level counts,
// privacy-preserving (no exact farmer coordinates).
export async function getHotspots() {
  const groups = {};
  diagnoses.forEach((d) => {
    const field = fields.find((f) => f.field_id === d.field_id);
    if (!field) return;
    const key = field.taluka;
    if (!groups[key]) groups[key] = { taluka: key, lats: [], lngs: [], diseases: {}, riskLevels: [] };
    groups[key].lats.push(field.lat);
    groups[key].lngs.push(field.lng);
    groups[key].diseases[d.disease] = (groups[key].diseases[d.disease] || 0) + 1;
    const risk = risks.find((r) => r.field_id === d.field_id);
    if (risk) groups[key].riskLevels.push(risk.risk_level);
  });

  const rank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const result = Object.values(groups).map((g) => {
    const avgLat = g.lats.reduce((a, b) => a + b, 0) / g.lats.length;
    const avgLng = g.lngs.reduce((a, b) => a + b, 0) / g.lngs.length;
    const dominantDisease = Object.entries(g.diseases).sort((a, b) => b[1] - a[1])[0][0];
    const dominantRisk = g.riskLevels.reduce((max, r) => (rank[r] > rank[max] ? r : max), "LOW");
    const count = Object.values(g.diseases).reduce((a, b) => a + b, 0);
    return {
      taluka: g.taluka,
      lat: avgLat,
      lng: avgLng,
      count,
      dominant_disease: dominantDisease,
      dominant_risk: dominantRisk,
    };
  });

  return delay(result);
}

// Not a distinct contract endpoint - derived client-side from GET /officer/hotspots/.
// Flags any taluka with 3+ cases of the same disease as an emerging cluster.
// CONFIRM with Person 3 whether this should instead be a real backend-computed
// field on the hotspots response (e.g. "is_cluster": true) once volumes are real.
export async function getClusterAlerts() {
  const groups = {};
  diagnoses.forEach((d) => {
    const field = fields.find((f) => f.field_id === d.field_id);
    if (!field) return;
    const key = `${field.taluka}::${d.disease}`;
    groups[key] = (groups[key] || 0) + 1;
  });
  const alerts = Object.entries(groups)
    .filter(([, count]) => count >= 3)
    .map(([key, count]) => {
      const [taluka, disease] = key.split("::");
      return { taluka, disease, count };
    });
  return delay(alerts);
}

// Broadcast messaging - contract has no dedicated endpoint for this yet.
// CONFIRM with Person 3: likely candidates would be a new
// POST /officer/broadcast/ { taluka, message, language } that fans out to
// farmer alerts (feeding into Person 3's /alerts/ table, read by Person 4).
// For now this is logged only, matching what's realistic to demo in 11 days.
const broadcastLog = [];
export async function sendBroadcast({ taluka, message }) {
  const farmersInTaluka = fields.filter((f) => f.taluka === taluka).length;
  const entry = {
    id: broadcastLog.length + 1,
    taluka,
    message,
    recipient_count: farmersInTaluka,
    sent_at: new Date().toISOString(),
  };
  broadcastLog.push(entry);
  return delay(entry);
}

export async function getBroadcastLog() {
  return delay([...broadcastLog].reverse());
}

// PATCH /officer/cases/{diagnosis_id}/  { action: "confirm"|"correct", corrected_disease }
export async function patchCase(diagnosisId, body) {
  const idx = diagnoses.findIndex((d) => d.diagnosis_id === diagnosisId);
  if (idx === -1) throw new Error("Diagnosis not found.");

  diagnoses[idx] = {
    ...diagnoses[idx],
    status: "verified",
    disease: body.action === "correct" && body.corrected_disease
      ? body.corrected_disease
      : diagnoses[idx].disease,
  };

  return delay({ ...diagnoses[idx] });
}

// ---------------- 2 & 4. Field Registration + Diagnosis (manual officer entry) ----------------
//
// The contract doesn't define a distinct "officer manual entry" endpoint -
// POST /diagnosis/ is documented as coming from Person 4 (farmer app upload).
// For an officer logging a case during a field visit, the most contract-consistent
// approach is to reuse the same two calls a farmer's app would make:
//   1. POST /fields/  (register the field if it doesn't already exist)
//   2. POST /diagnosis/  (multipart image + field_id)
// CONFIRM with Person 3 whether officers should call these same endpoints,
// or whether a dedicated POST /officer/cases/ should be added to the contract.
export async function createManualCase({ crop, variety, growth_stage, soil_type, lat, lng, village, taluka, district, disease, notes }) {
  const newFieldId = fields.length ? Math.max(...fields.map((f) => f.field_id)) + 1 : 1;
  const newField = { field_id: newFieldId, crop, variety, growth_stage, soil_type, lat, lng, village, taluka, district };
  fields = [...fields, newField];

  const newDiagnosisId = diagnoses.length ? Math.max(...diagnoses.map((d) => d.diagnosis_id)) + 1 : 1;
  const newDiagnosis = {
    diagnosis_id: newDiagnosisId,
    field_id: newFieldId,
    lat,
    lng,
    disease: disease || "Pending expert identification",
    confidence: 0, // manual entries have no AI confidence yet
    status: "pending_review",
    created_at: new Date().toISOString(),
    notes,
  };
  diagnoses = [...diagnoses, newDiagnosis];

  return delay({ ...newDiagnosis, crop, village, taluka, district });
}
