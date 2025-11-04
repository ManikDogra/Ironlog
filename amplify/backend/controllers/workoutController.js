// controllers/workoutController.js
import Workout from "../models/workout.js";

// Get all workouts for a user
export const getWorkouts = async (req, res) => {
  try {
    const userSub = req.user.sub; // from JWT
    const workouts = await Workout.find({ userSub }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error("Get workouts error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new workout
export const createWorkout = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const { name, exercises, date } = req.body;
    const workout = new Workout({
      userSub,
      name,
      exercises,
      date: date ? new Date(date) : new Date(),
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    console.error("Create workout error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update a workout
export const updateWorkout = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const { id } = req.params;
    const updates = req.body;
    const workout = await Workout.findOneAndUpdate(
      { _id: id, userSub },
      updates,
      { new: true }
    );
    if (!workout) return res.status(404).json({ error: "Workout not found" });
    res.json(workout);
  } catch (err) {
    console.error("Update workout error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a workout
export const deleteWorkout = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const { id } = req.params;
    const workout = await Workout.findOneAndDelete({ _id: id, userSub });
    if (!workout) return res.status(404).json({ error: "Workout not found" });
    res.json({ message: "Workout deleted" });
  } catch (err) {
    console.error("Delete workout error:", err);
    res.status(500).json({ error: err.message });
  }
};