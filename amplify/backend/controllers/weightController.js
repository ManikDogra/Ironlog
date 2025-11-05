// controllers/weightController.js
import WeightEntry from "../models/weightEntry.js";

// Helper: get date as UTC midnight
const getDateMidnight = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// Get today's weight entry (if exists)
export const getTodayWeight = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const today = getDateMidnight();
    const entry = await WeightEntry.findOne({ userSub, date: today }).lean();
    if (!entry) return res.status(404).json({ error: 'No weight entry for today' });
    res.json(entry);
  } catch (err) {
    console.error('Get today weight error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add or update today's weight
export const addWeight = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const { weight } = req.body;

    // Validate weight
    if (weight === undefined || weight === null) {
      return res.status(400).json({ error: 'Weight is required' });
    }
    const w = Number(weight);
    if (Number.isNaN(w) || w <= 0) {
      return res.status(400).json({ error: 'Weight must be a positive number' });
    }

    const today = getDateMidnight();

    // If user does not have a weight entry for today, auto-copy yesterday's weight first (if exists)
    const existingToday = await WeightEntry.findOne({ userSub, date: today });
    if (!existingToday) {
      const yesterday = new Date(today);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const yesterdayEntry = await WeightEntry.findOne({ userSub, date: yesterday }).lean();
      if (yesterdayEntry) {
        // Create today's entry with yesterday's weight (as placeholder)
        await WeightEntry.create({
          userSub,
          date: today,
          weight: yesterdayEntry.weight,
        });
      }
    }

    // Upsert today's weight (update if exists, create if not)
    const entry = await WeightEntry.findOneAndUpdate(
      { userSub, date: today },
      { weight: w, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.status(201).json(entry);
  } catch (err) {
    console.error('Add weight error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get weight history (last N days or all)
export const getWeightHistory = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const days = Math.min(365, Math.max(1, Number(req.query.days) || 365));
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    // Calculate date range (last N days)
    const today = getDateMidnight();
    const startDate = new Date(today);
    startDate.setUTCDate(startDate.getUTCDate() - days);

    const [entries, total] = await Promise.all([
      WeightEntry.find({ userSub, date: { $gte: startDate, $lte: today } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WeightEntry.countDocuments({ userSub, date: { $gte: startDate, $lte: today } })
    ]);

    res.json({ total, page, limit, items: entries });
  } catch (err) {
    console.error('Get weight history error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a weight entry
export const deleteWeight = async (req, res) => {
  try {
    const userSub = req.user.sub;
    const { date } = req.params;

    // Parse date and convert to UTC midnight
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    const dateKey = getDateMidnight(d);

    const entry = await WeightEntry.findOneAndDelete({ userSub, date: dateKey });
    if (!entry) return res.status(404).json({ error: 'Weight entry not found' });
    res.json({ message: 'Weight entry deleted' });
  } catch (err) {
    console.error('Delete weight error:', err);
    res.status(500).json({ error: err.message });
  }
};
