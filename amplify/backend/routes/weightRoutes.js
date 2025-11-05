// routes/weightRoutes.js
import express from "express";
import { getTodayWeight, addWeight, getWeightHistory, deleteWeight } from "../controllers/weightController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.get("/today", getTodayWeight);
router.post("/", addWeight);
router.get("/history", getWeightHistory);
router.delete("/:date", deleteWeight);

export default router;
