const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const prisma = require("../prismaClient");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const CONFIDENCE_THRESHOLD = 0.9;

// POST /api/diagnosis  (multipart: field_id, image)
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  const { field_id } = req.body;
  if (!field_id || !req.file) {
    return res.status(400).json({ error: "field_id and image are required" });
  }

  let aiResult;
  try {
    const form = new FormData();
    form.append("image", fs.createReadStream(req.file.path));
    const aiResponse = await fetch(process.env.AI_SERVICE_URL, {
      method: "POST",
      body: form,
    });
    aiResult = await aiResponse.json();
    // Expected shape from Person 1: { disease, confidence, status }
  } catch (err) {
    // AI service down/unreachable — still record the upload so nothing is lost
    aiResult = { disease: null, confidence: null, status: "AI_SERVICE_UNAVAILABLE" };
  }

  const routedTo =
    aiResult.confidence != null && aiResult.confidence >= CONFIDENCE_THRESHOLD
      ? "routed_farmer"
      : "routed_officer";

  const diagnosis = await prisma.diagnosis.create({
    data: {
      fieldId: Number(field_id),
      imageUrl: req.file.path,
      disease: aiResult.disease,
      confidence: aiResult.confidence,
      status: routedTo,
    },
  });

  await prisma.alert.create({
    data: {
      fieldId: Number(field_id),
      type: "diagnosis",
      message: aiResult.disease
        ? `Diagnosis ready: ${aiResult.disease} (${Math.round((aiResult.confidence || 0) * 100)}%)`
        : "Diagnosis pending expert review",
    },
  });

  res.status(201).json({
    diagnosis_id: diagnosis.id,
    disease: diagnosis.disease,
    confidence: diagnosis.confidence,
    status: diagnosis.status,
    routed_to: routedTo === "routed_farmer" ? "farmer" : "officer",
  });
});

// GET /api/diagnosis/:id
router.get("/:id", requireAuth, async (req, res) => {
  const diagnosis = await prisma.diagnosis.findUnique({ where: { id: Number(req.params.id) } });
  if (!diagnosis) return res.status(404).json({ error: "Not found" });
  res.json(diagnosis);
});

// GET /api/diagnosis/queue/list  (officer only) — low-confidence cases
router.get("/queue/list", requireAuth, requireRole("officer"), async (req, res) => {
  const queue = await prisma.diagnosis.findMany({
    where: { status: "routed_officer", verified: false },
    include: { field: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(queue);
});

module.exports = router;
