import { useState } from "react";
import { createManualCase } from "../api/mockApi";

const CROPS = ["cotton", "soybean", "pigeonpea"];
const GROWTH_STAGES = ["vegetative", "flowering", "boll/pod formation", "maturity"];
const SOIL_TYPES = ["black", "medium black", "red"];

export default function ManualEntryForm() {
  const [form, setForm] = useState({
    crop: "cotton",
    variety: "",
    growth_stage: "vegetative",
    soil_type: "black",
    village: "",
    taluka: "",
    district: "",
    lat: "",
    lng: "",
    disease: "",
    notes: "",
  });
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const result = await createManualCase({
      ...form,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
    });
    setSubmitted(result);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="bg-white border border-agri-beige-300 rounded-xl p-6 max-w-lg">
        <h2 className="text-lg font-bold text-agri-green-800 mb-2">Case Logged ✅</h2>
        <p className="text-sm text-agri-green-700 mb-4">
          New diagnosis <span className="font-mono">#{submitted.diagnosis_id}</span> created for{" "}
          {submitted.village}, {submitted.taluka} — status:{" "}
          <span className="font-semibold">{submitted.status}</span>
        </p>
        <button
          onClick={() => setSubmitted(null)}
          className="bg-agri-green-600 hover:bg-agri-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          Log another case
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-agri-beige-300 rounded-xl p-6 max-w-2xl space-y-4">
      <h2 className="text-xl font-bold text-agri-green-800">Log a Field-Visit Case</h2>
      <p className="text-sm text-agri-green-600 -mt-2">
        For cases identified during a physical visit rather than a farmer's app submission.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Crop">
          <select value={form.crop} onChange={(e) => update("crop", e.target.value)} className={inputClass}>
            {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Variety">
          <input value={form.variety} onChange={(e) => update("variety", e.target.value)} className={inputClass} placeholder="e.g. Bt-Cotton RCH-2" />
        </Field>
        <Field label="Growth stage">
          <select value={form.growth_stage} onChange={(e) => update("growth_stage", e.target.value)} className={inputClass}>
            {GROWTH_STAGES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Soil type">
          <select value={form.soil_type} onChange={(e) => update("soil_type", e.target.value)} className={inputClass}>
            {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Village">
          <input value={form.village} onChange={(e) => update("village", e.target.value)} className={inputClass} required />
        </Field>
        <Field label="Taluka">
          <input value={form.taluka} onChange={(e) => update("taluka", e.target.value)} className={inputClass} required />
        </Field>
        <Field label="District">
          <input value={form.district} onChange={(e) => update("district", e.target.value)} className={inputClass} required />
        </Field>
        <Field label="Suspected disease/pest">
          <input value={form.disease} onChange={(e) => update("disease", e.target.value)} className={inputClass} placeholder="e.g. Pink Bollworm" />
        </Field>
        <Field label="Latitude">
          <input type="number" step="any" value={form.lat} onChange={(e) => update("lat", e.target.value)} className={inputClass} required />
        </Field>
        <Field label="Longitude">
          <input type="number" step="any" value={form.lng} onChange={(e) => update("lng", e.target.value)} className={inputClass} required />
        </Field>
      </div>

      <Field label="Field notes">
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="Symptoms observed, extent of spread, farmer's account, etc."
        />
      </Field>

      <Field label="Photo (optional)">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="text-sm text-agri-green-700"
        />
        {photo && <p className="text-xs text-agri-green-500 mt-1">Selected: {photo.name} (not uploaded in this mock — wire to POST /diagnosis/ once the backend is live)</p>}
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="bg-agri-green-600 hover:bg-agri-green-700 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Case"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-agri-beige-400 bg-agri-beige-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green-400";

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-agri-green-800">
      {label}
      <div className="mt-1 font-normal">{children}</div>
    </label>
  );
}
