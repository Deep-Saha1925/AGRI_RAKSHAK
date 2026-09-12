import { Router } from "express";
import { getAdvisory, createRecheck, updateRecheck } from "./advisory.controller.js";

const router = Router();


router.get("/:disease/", getAdvisory); // GET /api/advisory/Blast/
router.post("/recheck/", createRecheck); // POST /api/advisory/recheck/
router.post("/recheck/:id/result/", updateRecheck); // POST /api/advisory/recheck/1/result/

export default router;