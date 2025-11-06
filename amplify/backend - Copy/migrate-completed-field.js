// File: amplify/backend/migrate-completed-field.js
// This script adds the `completed: false` field to all existing workouts that don't have it

import mongoose from 'mongoose';
import Workout from './models/workout.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function migrateWorkouts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all workouts where completed field doesn't exist
    const workoutsWithoutCompleted = await Workout.find({ completed: { $exists: false } });
    console.log(`Found ${workoutsWithoutCompleted.length} workouts without completed field`);

    if (workoutsWithoutCompleted.length > 0) {
      // Update all of them to set completed: false
      const result = await Workout.updateMany(
        { completed: { $exists: false } },
        { $set: { completed: false } }
      );
      console.log(`✅ Updated ${result.modifiedCount} workouts`);
    } else {
      console.log('✅ All workouts already have completed field');
    }

    // Show stats
    const totalWorkouts = await Workout.countDocuments();
    const completedWorkouts = await Workout.countDocuments({ completed: true });
    const activeWorkouts = await Workout.countDocuments({ completed: false });

    console.log('\n📊 Database Stats:');
    console.log(`- Total workouts: ${totalWorkouts}`);
    console.log(`- Completed: ${completedWorkouts}`);
    console.log(`- Active: ${activeWorkouts}`);

    console.log('\n✅ Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  }
}

migrateWorkouts();
