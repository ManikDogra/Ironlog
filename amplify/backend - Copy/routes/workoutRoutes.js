import express from "express";
import { getWorkouts, getTodayWorkout, getWorkoutHistory, createWorkout, updateWorkout, completeWorkout, deleteWorkout, undoCompleteWorkout, getPersonalRecords, getPROccurrences } from "../controllers/workoutController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.get("/", getWorkouts);
router.get("/today", getTodayWorkout);
router.get("/prs", getPersonalRecords);
router.get("/pr/:exercise", getPROccurrences);
router.get("/history", getWorkoutHistory);
router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.post("/:id/complete", completeWorkout);
router.post("/:id/undo", undoCompleteWorkout);
router.delete("/:id", deleteWorkout);

export default router;
