const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/advisory/:disease
router.get("/:disease", requireAuth, async (req, res) => {
  const advisory = await prisma.advisory.findUnique({ where: { disease: req.params.disease } });
  if (!advisory) return res.status(404).json({ error: "No advisory found for this disease" });
  res.json(advisory);
});

// POST /api/advisory  (officer/admin creates content — Person 6's data)
router.post("/", requireAuth, requireRole("officer"), async (req, res) => {
  const { disease, steps, escalate_if } = req.body;
  const advisory = await prisma.advisory.upsert({
    where: { disease },
    update: { steps, escalateIf: escalate_if },
    create: { disease, steps, escalateIf: escalate_if },
  });
  res.status(201).json(advisory);
});

// POST /api/advisory/recheck
router.post("/recheck", requireAuth, async (req, res) => {
  const { diagnosis_id, scheduled_for } = req.body;
  const recheck = await prisma.recheck.create({
    data: { diagnosisId: Number(diagnosis_id), scheduledFor: new Date(scheduled_for) },
  });
  res.status(201).json(recheck);
});

// POST /api/advisory/recheck/:id/result
router.post("/recheck/:id/result", requireAuth, async (req, res) => {
  const { status } = req.body; // "improved" | "worsened"
  const recheck = await prisma.recheck.update({
    where: { id: Number(req.params.id) },
    data: { status },
  });
  res.json(recheck);
});

module.exports = router;