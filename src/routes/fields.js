const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// POST /api/fields
router.post("/", async (req, res) => {
  const { crop, variety, growth_stage, soil_type, lat, lng } = req.body;
  if (!crop || !growth_stage || !soil_type || lat == null || lng == null) {
    return res.status(400).json({ error: "crop, growth_stage, soil_type, lat, lng are required" });
  }
  const field = await prisma.field.create({
    data: {
      farmerId: req.user.id,
      crop, variety, growthStage: growth_stage, soilType: soil_type,
      lat: Number(lat), lng: Number(lng),
    },
  });
  res.status(201).json({ field_id: field.id, created_at: field.createdAt });
});

// GET /api/fields
router.get("/", async (req, res) => {
  const fields = await prisma.field.findMany({ where: { farmerId: req.user.id } });
  res.json(fields);
});

// GET /api/fields/:id  (field detail + latest risk + latest diagnosis)
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const field = await prisma.field.findUnique({
    where: { id },
    include: {
      risks: { orderBy: { computedAt: "desc" }, take: 1 },
      diagnoses: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!field) return res.status(404).json({ error: "Field not found" });
  res.json(field);
});

module.exports = router;