import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userSub: { type: String, required: true, unique: true },
  name: { type: String },
  weight: { type: Number },
  gender: { type: String },
  goal: { type: String },
  age: { type: Number },
  height: { type: Number },
  // store dates (ISO) when the user logged in (one entry per day)
  loginDates: { type: [Date], default: [] },
  // Mark whether the user has completed their profile setup.
  profileCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { collection: "Profile" });

export default mongoose.model("Profile", profileSchema);
