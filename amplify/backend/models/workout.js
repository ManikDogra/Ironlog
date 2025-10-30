// models/Workout.js (ESM)
import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
  weight: Number
}, { _id: false });

const workoutSchema = new mongoose.Schema({
  userSub: { type: String, required: true }, // link to Cognito sub
  date: { type: Date, default: Date.now },
  name: { type: String, required: true },
  exercises: [exerciseSchema]
}, { collection: "workouts" });

export default mongoose.model("Workout", workoutSchema);
