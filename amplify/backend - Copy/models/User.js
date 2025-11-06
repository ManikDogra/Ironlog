// models/User.js (ESM)
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  sub: { type: String, required: true, unique: true }, // Cognito sub (user id)
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { collection: "users" });

export default mongoose.model("User", userSchema);
