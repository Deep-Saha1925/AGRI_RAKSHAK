const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// POST /api/risk  -- called by Person 2's service
// NOTE: for the hackathon, protect this with the same JWT (give Person 2 a
// service account) rather than building a separate API-key system.
router.post("/", requireAuth, async (req, res) => {
  const { field_id, risk_level, risk_score, irrigation, reason } = req.body;
  if (!field_id || !risk_level || risk_score == null || !irrigation || !reason) {
    return res.status(400).json({ error: "field_id, risk_level, risk_score, irrigation, reason are required" });
  }

  const risk = await prisma.risk.create({
    data: {
      fieldId: Number(field_id),
      riskLevel: risk_level,
      riskScore: Number(risk_score),
      irrigation,
      reason,
    },
  });

  if (risk_level === "HIGH") {
    await prisma.alert.create({
      data: {
        fieldId: Number(field_id),
        type: "risk",
        message: `HIGH RISK — inspect your field. ${reason}`,
      },
    });
  }

  res.status(201).json(risk);
});

// GET /api/risk/:fieldId/latest
router.get("/:fieldId/latest", requireAuth, async (req, res) => {
  const fieldId = Number(req.params.fieldId);
  const risk = await prisma.risk.findFirst({
    where: { fieldId },
    orderBy: { computedAt: "desc" },
  });
  if (!risk) return res.status(404).json({ error: "No risk data yet for this field" });
  res.json(risk);
});

module.exports = router;
