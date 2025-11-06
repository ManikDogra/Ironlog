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

// Health check endpoint (must come BEFORE CORS for Beanstalk health checks)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Allow requests from the frontend and allow credentials so cookies can be cleared/set
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://main.d1ooh0nczm0urv.amplifyapp.com",
      "https://ironlog-three.vercel.app",
      "https://ironlog.vercel.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Extra safety: explicitly respond to preflight (OPTIONS) requests and
// ensure CORS headers are present even if a proxy or host attempts a redirect.
// This avoids "Redirect is not allowed for a preflight request" in browsers.
app.use((req, res, next) => {
  const allowed = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://main.d1ooh0nczm0urv.amplifyapp.com',
    'https://ironlog-three.vercel.app',
    'https://ironlog.vercel.app'
  ];
  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Immediately handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

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

// Start the server
// Elastic Beanstalk expects port 80; use PORT env variable if available, otherwise 80
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
