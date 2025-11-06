import mongoose from 'mongoose';
import Workout from './models/workout.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const all = await Workout.find({});
    console.log(`📊 Total workouts: ${all.length}\n`);

    all.forEach(w => {
      console.log(`Name: ${w.name}`);
      console.log(`UserSub: ${w.userSub}`);
      console.log(`Date: ${w.date}`);
      console.log(`Completed: ${w.completed}`);
      console.log('---');
    });

    // Check today's range
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    console.log(`\n🔍 TODAY'S DATE RANGE (LOCAL):`);
    console.log(`From: ${start}`);
    console.log(`To: ${end}`);

    const todayWorkouts = await Workout.find({
      date: { $gte: start, $lt: end },
      completed: { $ne: true }
    });
    console.log(`\n📅 Active workouts today: ${todayWorkouts.length}`);
    todayWorkouts.forEach(w => console.log(`- ${w.name}`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
