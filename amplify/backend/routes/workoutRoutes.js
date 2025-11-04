import express from "express";
import { getWorkouts, createWorkout, updateWorkout, deleteWorkout } from "../controllers/workoutController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.get("/", getWorkouts);
router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
