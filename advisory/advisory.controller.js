import * as service from "./advisory.service.js";

// GET /api/advisory/:disease/ -> Person 4 (farmer app) calls this
// Example: GET /api/advisory/Blast/?district=Nashik&area=7.47&yield=2.11
export async function getAdvisory(req, res) {
  try {
    const { disease } = req.params;
    const { district, area, yield: yield_prod } = req.query;

    let result;
    if (district) {
      result = await service.getAdvisoryWithDistrict(disease, district, area || 5, yield_prod || 2);
    } else {
      result = await service.getAdvisoryByDisease(disease);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/advisory/recheck/ -> Schedule follow-up
// Body: { diagnosis_id: 45, scheduled_for: "2026-09-15" }
export async function createRecheck(req, res) {
  try {
    const { diagnosis_id, scheduled_for } = req.body;
    const result = await service.scheduleRecheck(diagnosis_id, scheduled_for);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/advisory/recheck/:id/result/ -> Farmer/Officer updates result
// Body: { status: "improved" | "worsened", new_diagnosis_id: 46 }
export async function updateRecheck(req, res) {
  try {
    const { id } = req.params;
    const { status, new_diagnosis_id } = req.body;
    const result = await service.submitRecheckResult(id, status, new_diagnosis_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}