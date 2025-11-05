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

// Get today's workout (if any) for the current user
export const getTodayWorkout = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    // Only return today's active (not-yet-completed) workout so users can
    // create a new one after completing the previous workout.
    const workout = await Workout.findOne({ 
      userSub, 
      date: { $gte: start, $lt: end },
      completed: { $ne: true }
    }).sort({ date: -1 }).lean();
    
    if (!workout) {
      console.log(`No workout found for userSub: ${userSub}, date range: ${start} to ${end}`);
      return res.status(404).json({ error: 'No workout for today' });
    }
    
    console.log(`Found today's workout: ${workout._id}, completed: ${workout.completed}`);
    res.json(workout);
  } catch (err) {
    console.error('Get today workout error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new workout
export const createWorkout = async (req, res) => {
  try {
    const userSub = req.user.sub;
    // validate input
    const { name, exercises, date } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Workout name is required and must be a string' });
    }
    if (name.length > 100) {
      return res.status(400).json({ error: 'Workout name must be 100 characters or less' });
    }
    // workout name should only contain letters and spaces
    const nameTrim = name.trim();
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(nameTrim)) {
      return res.status(400).json({ error: 'Workout name cannot include numbers or symbols' });
    }
    const exs = Array.isArray(exercises) ? exercises : [];
    if (exs.length > 50) {
      return res.status(400).json({ error: 'Cannot add more than 50 exercises per workout' });
    }
    for (const [i, ex] of exs.entries()) {
      if (!ex || typeof ex.name !== 'string' || ex.name.trim() === '') {
        return res.status(400).json({ error: `Exercise at index ${i} must have a non-empty name` });
      }
      if (ex.name.length > 100) {
        return res.status(400).json({ error: `Exercise name at index ${i} must be 100 characters or less` });
      }
      // exercise name should only contain letters, spaces, and hyphens
      const exNameTrim = String(ex.name).trim();
      const exNameRegex = /^[A-Za-z\s\-]+$/;
      if (!exNameRegex.test(exNameTrim)) {
        return res.status(400).json({ error: `Exercise name at index ${i} can only contain letters, spaces, and hyphens` });
      }
      const s = Number(ex.sets);
      const r = Number(ex.reps);
      const w = Number(ex.weight);
      if (Number.isNaN(s) || s < 0 || Number.isNaN(r) || r < 0 || Number.isNaN(w) || w < 0) {
        return res.status(400).json({ error: `Exercise at index ${i} must have non-negative numeric sets, reps and weight` });
      }
      if (s > 1000 || r > 1000 || w > 10000) {
        return res.status(400).json({ error: `Exercise at index ${i} has unrealistic values (sets/reps max 1000, weight max 10000)` });
      }
    }

    // Parse date string (YYYY-MM-DD) to local midnight
    let workoutDate;
    if (date && typeof date === 'string') {
      const [year, month, day] = date.split('-').map(Number);
      workoutDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    } else {
      workoutDate = new Date();
      workoutDate.setHours(0, 0, 0, 0);
    }
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // If there are existing uncompleted workouts for today, archive them to history
    const start = new Date(workoutDate);
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    await Workout.updateMany(
      { userSub, date: { $gte: start, $lt: end }, completed: { $ne: true } },
      { $set: { completed: true, completedAt: new Date() } }
    );

    const normalizedExercises = exs.map((ex) => ({
      name: String(ex.name).trim(),
      sets: Number(ex.sets) || 0,
      reps: Number(ex.reps) || 0,
      weight: Number(ex.weight) || 0,
    }));

    const workout = new Workout({
      userSub,
      name: String(name).trim(),
      exercises: normalizedExercises,
      date: workoutDate,
      day: dayNames[workoutDate.getDay()],
      completed: false,
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
    // validate updates if present
    if (updates.name !== undefined) {
      if (!updates.name || typeof updates.name !== 'string' || updates.name.trim() === '') {
        return res.status(400).json({ error: 'Workout name must be a non-empty string' });
      }
      // validate characters
      const uName = updates.name.trim();
      const nameRegex2 = /^[A-Za-z\s]+$/;
      if (!nameRegex2.test(uName)) {
        return res.status(400).json({ error: 'Workout name cannot include numbers or symbols' });
      }
      updates.name = uName;
    }
    if (updates.exercises !== undefined) {
      if (!Array.isArray(updates.exercises)) {
        return res.status(400).json({ error: 'Exercises must be an array' });
      }
      for (const [i, ex] of updates.exercises.entries()) {
        if (!ex || typeof ex.name !== 'string' || ex.name.trim() === '') {
          return res.status(400).json({ error: `Exercise at index ${i} must have a non-empty name` });
        }
        // exercise name should only contain letters, spaces, and hyphens
        const exNameTrim2 = String(ex.name).trim();
        const exNameRegex2 = /^[A-Za-z\s\-]+$/;
        if (!exNameRegex2.test(exNameTrim2)) {
          return res.status(400).json({ error: `Exercise name at index ${i} can only contain letters, spaces, and hyphens` });
        }
        const s = Number(ex.sets);
        const r = Number(ex.reps);
        const w = Number(ex.weight);
        if (Number.isNaN(s) || s < 0 || Number.isNaN(r) || r < 0 || Number.isNaN(w) || w < 0) {
          return res.status(400).json({ error: `Exercise at index ${i} must have non-negative numeric sets, reps and weight` });
        }
        // normalize
        ex.name = ex.name.trim();
        ex.sets = Number(ex.sets) || 0;
        ex.reps = Number(ex.reps) || 0;
        ex.weight = Number(ex.weight) || 0;
      }
    }
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

// Mark a workout as complete: set completed true and completedAt timestamp
export const completeWorkout = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const { id } = req.params;
    const updates = { completed: true, completedAt: new Date() };
    const workout = await Workout.findOneAndUpdate({ _id: id, userSub }, updates, { new: true }).lean();
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    console.error('Complete workout error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Undo complete: mark a workout as not completed and clear completedAt
export const undoCompleteWorkout = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const { id } = req.params;
    const updates = { completed: false, completedAt: null };
    const workout = await Workout.findOneAndUpdate({ _id: id, userSub }, updates, { new: true }).lean();
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    console.error('Undo complete workout error:', err);
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

// Return completed workouts (history)
export const getWorkoutHistory = async (req, res) => {
  try {
    const userSub = req.user.sub;
    // pagination
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    const [workouts, total] = await Promise.all([
      Workout.find({ userSub, completed: true }).sort({ completedAt: -1 }).skip(skip).limit(limit).lean(),
      Workout.countDocuments({ userSub, completed: true })
    ]);

    res.json({ total, page, limit, items: workouts });
  } catch (err) {
    console.error('Get workout history error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Return personal records (PRs) per exercise for the user
export const getPersonalRecords = async (req, res) => {
  try {
    const userSub = req.user.sub;

    // Aggregation: unwind exercises, normalize name to lower-trim, sort by weight desc+date, then group by exercise name and pick top entry
    const pipeline = [
      { $match: { userSub, completed: true } },
      { $unwind: "$exercises" },
      { $addFields: { exName: { $trim: { input: { $toLower: "$exercises.name" } } } } },
      { $sort: { "exercises.weight": -1, completedAt: -1 } },
      { $group: {
          _id: "$exName",
          exercise: { $first: "$exercises.name" },
          weight: { $first: "$exercises.weight" },
          sets: { $first: "$exercises.sets" },
          reps: { $first: "$exercises.reps" },
          workoutId: { $first: "$_id" },
          workoutName: { $first: "$name" },
          date: { $first: "$completedAt" }
      }},
      { $project: { _id: 0, exercise: 1, weight: 1, sets: 1, reps: 1, workoutId: 1, workoutName: 1, date: 1 } },
      { $sort: { weight: -1 } }
    ];

    const prs = await Workout.aggregate(pipeline).allowDiskUse(true);
    res.json(prs);
  } catch (err) {
    console.error('Get personal records error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Return occurrences for a specific exercise (paginated)
export const getPROccurrences = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const rawName = req.params.exercise || "";
    const exerciseName = rawName.trim().toLowerCase();
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    // Aggregation to filter exercises array and return matching occurrences
    const pipeline = [
      { $match: { userSub, completed: true } },
      { $project: {
          name: 1,
          completedAt: 1,
          date: 1,
          exercises: {
            $filter: {
              input: "$exercises",
              as: "ex",
              cond: { $eq: [ { $toLower: { $trim: "$$ex.name" } }, exerciseName ] }
            }
          }
      }},
      { $unwind: "$exercises" },
      { $project: { workoutName: "$name", date: { $ifNull: ["$completedAt", "$date"] }, weight: "$exercises.weight", sets: "$exercises.sets", reps: "$exercises.reps" } },
      { $sort: { date: -1 } },
      { $facet: {
          items: [ { $skip: skip }, { $limit: limit } ],
          totalCount: [ { $count: "count" } ]
      }}
    ];

    const agg = await Workout.aggregate(pipeline).allowDiskUse(true);
    const items = (agg[0] && agg[0].items) || [];
    const total = (agg[0] && agg[0].totalCount && agg[0].totalCount[0] && agg[0].totalCount[0].count) || 0;
    res.json({ total, page, limit, items });
  } catch (err) {
    console.error('Get PR occurrences error:', err);
    res.status(500).json({ error: err.message });
  }
};