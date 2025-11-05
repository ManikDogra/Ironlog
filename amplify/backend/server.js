// server.js (ES module version)

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import weightRoutes from "./routes/weightRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";
import cors from "cors";
// Load the .env file located in this folder (amplify/backend/.env)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
// Allow requests from the frontend and allow credentials so cookies can be cleared/set
app.use(
  cors({
    origin: (origin, cb) => cb(null, origin || "http://localhost:5173"),
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/workouts", workoutRoutes);
app.use("/weight", weightRoutes);
// Mount dev-only debug routes (requires valid token)
app.use("/debug", debugRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Example route (for testing)
app.get('/', (req, res) => {
  res.send('IronLog backend is running ✅');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
