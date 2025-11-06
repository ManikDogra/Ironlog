// File: amplify/backend/fix-workout-dates.js
// This script updates all active workouts to today's date so they appear on Today's page

import mongoose from 'mongoose';
import Workout from './models/workout.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function fixWorkoutDates() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all active (not completed) workouts
    const activeWorkouts = await Workout.find({ completed: false });
    console.log(`Found ${activeWorkouts.length} active workouts`);

    if (activeWorkouts.length > 0) {
      console.log('\n📅 Workouts BEFORE update:');
      activeWorkouts.forEach((w) => {
        console.log(`- ${w.name}: ${w.date}`);
      });

      // Update their dates to today
      const result = await Workout.updateMany(
        { completed: false },
        { $set: { date: today } }
      );

      console.log(`\n✅ Updated ${result.modifiedCount} workouts to today's date`);

      // Show updated workouts
      const updated = await Workout.find({ completed: false });
      console.log('\n📅 Workouts AFTER update:');
      updated.forEach((w) => {
        console.log(`- ${w.name}: ${w.date}`);
      });
    } else {
      console.log('No active workouts to update');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixWorkoutDates();
