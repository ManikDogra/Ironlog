import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from '../amplify/backend/routes/authRoutes.js';
import profileRoutes from '../amplify/backend/routes/profileRoutes.js';
import workoutRoutes from '../amplify/backend/routes/workoutRoutes.js';
import weightRoutes from '../amplify/backend/routes/weightRoutes.js';
import debugRoutes from '../amplify/backend/routes/debugRoutes.js';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../amplify/backend/.env') });

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));

// CORS - allow all Vercel domains
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'vercel'
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/workouts', workoutRoutes);
app.use('/weight', weightRoutes);
app.use('/debug', debugRoutes);

// MongoDB connection (only once per function)
let mongoConnected = false;

const connectMongo = async () => {
  if (mongoConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    mongoConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB error:', err);
    throw err;
  }
};

// Main handler
export default async (req, res) => {
  await connectMongo();
  app(req, res);
};
