import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from '../../amplify/backend/routes/authRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../amplify/backend/.env') });

let mongoConnected = false;

const connectMongo = async () => {
  if (mongoConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    mongoConnected = true;
  } catch (err) {
    console.error('MongoDB error:', err);
  }
};

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectMongo();

  if (req.method === 'POST' && req.url === '/auth/login') {
    try {
      const User = mongoose.model('User');
      const { username, password } = req.body;
      // Your login logic here
      return res.status(200).json({ message: 'Login endpoint' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(404).json({ error: 'Not found' });
};
