// models/Workout.js (ESM)
import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, match: [/^[A-Za-z\s\-]+$/, 'Exercise name can only contain letters, spaces, and hyphens'] },
  sets: { type: Number, default: 0, min: [0, 'Sets must be >= 0'] },
  reps: { type: Number, default: 0, min: [0, 'Reps must be >= 0'] },
  weight: { type: Number, default: 0, min: [0, 'Weight must be >= 0'] },
  completed: { type: Boolean, default: false }
}, { _id: false });

const workoutSchema = new mongoose.Schema({
  userSub: { type: String, required: true }, // link to Cognito sub
  date: { type: Date, default: Date.now },
  // Day name for easier history grouping (e.g., Mon, Tue)
  day: { type: String },
  name: { type: String, required: true, trim: true, match: [/^[A-Za-z\s]+$/, 'Workout name can only contain letters and spaces'] },
  exercises: { type: [exerciseSchema], default: [] },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { collection: "workouts" });

// Indexes to speed up history and exercise queries
workoutSchema.index({ userSub: 1, completed: 1, completedAt: -1 });
workoutSchema.index({ userSub: 1, 'exercises.name': 1 });

export default mongoose.model("Workout", workoutSchema);
