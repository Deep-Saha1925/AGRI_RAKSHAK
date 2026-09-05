const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/alerts  -- unread alerts for the logged-in farmer's fields
router.get("/", async (req, res) => {
  const alerts = await prisma.alert.findMany({
    where: { read: false, field: { farmerId: req.user.id } },
    orderBy: { createdAt: "desc" },
  });
  res.json(alerts);
});

// POST /api/alerts/:id/read
router.post("/:id/read", async (req, res) => {
  const alert = await prisma.alert.update({
    where: { id: Number(req.params.id) },
    data: { read: true },
  });
  res.json(alert);
});

module.exports = router;
