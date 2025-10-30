// server.js (ES module version)

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
// Allow requests from the frontend and allow credentials so cookies can be cleared/set
app.use(
  cors({
    origin: (origin, cb) => cb(null, origin || "http://localhost:5173"),
    credentials: true,
  })
);

app.use("/auth", authRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Example route (for testing)
app.get('/', (req, res) => {
  res.send('IronLog backend is running ✅');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
