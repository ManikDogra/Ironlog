// models/weightEntry.js (ESM)
import mongoose from "mongoose";

const weightEntrySchema = new mongoose.Schema({
  userSub: { type: String, required: true }, // link to Cognito sub
  date: { type: Date, required: true }, // stored as UTC midnight for the day
  weight: { type: Number, required: true, min: [0.1, 'Weight must be > 0'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: "weightEntries" });

// Unique index: one weight entry per user per day
weightEntrySchema.index({ userSub: 1, date: 1 }, { unique: true });

// Index for efficient history queries
weightEntrySchema.index({ userSub: 1, date: -1 });

export default mongoose.model("WeightEntry", weightEntrySchema);
