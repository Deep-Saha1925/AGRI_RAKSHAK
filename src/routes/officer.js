const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth, requireRole("officer"));

// GET /api/officer/cases?crop=&disease=&risk=
router.get("/cases", async (req, res) => {
  const { crop, disease, risk } = req.query;

  const diagnoses = await prisma.diagnosis.findMany({
    where: {
      disease: disease || undefined,
      field: {
        crop: crop || undefined,
        risks: risk ? { some: { riskLevel: risk } } : undefined,
      },
    },
    include: { field: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(
    diagnoses.map((d) => ({
      diagnosis_id: d.id,
      field_id: d.fieldId,
      lat: d.field.lat,
      lng: d.field.lng,
      disease: d.disease,
      confidence: d.confidence,
      status: d.status,
    }))
  );
});

// PATCH /api/officer/cases/:id
router.patch("/cases/:id", async (req, res) => {
  const { action, corrected_disease } = req.body; // "confirm" | "correct"
  const id = Number(req.params.id);

  if (action === "correct" && !corrected_disease) {
    return res.status(400).json({ error: "corrected_disease required when action=correct" });
  }

  const diagnosis = await prisma.diagnosis.update({
    where: { id },
    data: {
      verified: true,
      status: "verified",
      correctedDisease: action === "correct" ? corrected_disease : null,
    },
  });

  res.json(diagnosis);
});

// GET /api/officer/hotspots  (village/taluka aggregated, privacy-preserving)
router.get("/hotspots", async (req, res) => {
  // For the hackathon: round lat/lng to ~2 decimals (~1km) to aggregate instead
  // of exposing exact farmer coordinates. Swap for a real taluka lookup if time allows.
  const diagnoses = await prisma.diagnosis.findMany({
    where: { disease: { not: null } },
    include: { field: true },
  });

  const buckets = {};
  for (const d of diagnoses) {
    const key = `${d.field.lat.toFixed(2)}_${d.field.lng.toFixed(2)}_${d.disease}`;
    if (!buckets[key]) {
      buckets[key] = {
        lat: Number(d.field.lat.toFixed(2)),
        lng: Number(d.field.lng.toFixed(2)),
        disease: d.disease,
        count: 0,
      };
    }
    buckets[key].count += 1;
  }

  res.json(Object.values(buckets));
});

module.exports = router;