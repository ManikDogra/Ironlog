// A small curated list of common workout templates and a global exercise list.
// This is frontend-only and can be replaced by a backend-driven list later.

export const workoutTemplates = [
  {
    name: 'Full Body',
    exercises: [
      { name: 'Squat', sets: 3, reps: 8, weight: 0 },
      { name: 'Bench Press', sets: 3, reps: 8, weight: 0 },
      { name: 'Deadlift', sets: 3, reps: 5, weight: 0 },
    ],
  },
  {
    name: 'Back',
    exercises: [
      { name: 'Pull-up', sets: 3, reps: 6, weight: 0 },
      { name: 'Barbell Row', sets: 3, reps: 8, weight: 0 },
      { name: 'Lat Pulldown', sets: 3, reps: 10, weight: 0 },
    ],
  },
  {
    name: 'Legs',
    exercises: [
      { name: 'Squat', sets: 4, reps: 6, weight: 0 },
      { name: 'Lunge', sets: 3, reps: 10, weight: 0 },
      { name: 'Leg Press', sets: 3, reps: 10, weight: 0 },
    ],
  },
  {
    name: 'Shoulders',
    exercises: [
      { name: 'Overhead Press', sets: 3, reps: 8, weight: 0 },
      { name: 'Lateral Raise', sets: 3, reps: 12, weight: 0 },
      { name: 'Rear Delt Fly', sets: 3, reps: 12, weight: 0 },
    ],
  },
  {
    name: 'Push',
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 8, weight: 0 },
      { name: 'Overhead Press', sets: 3, reps: 8, weight: 0 },
      { name: 'Triceps Dip', sets: 3, reps: 10, weight: 0 },
    ],
  },
  {
    name: 'Pull',
    exercises: [
      { name: 'Pull-up', sets: 3, reps: 6, weight: 0 },
      { name: 'Barbell Row', sets: 3, reps: 8, weight: 0 },
      { name: 'Biceps Curl', sets: 3, reps: 10, weight: 0 },
    ],
  },
];

export const globalExercises = [
  'Squat',
  'Bench Press',
  'Deadlift',
  'Pull-up',
  'Barbell Row',
  'Lat Pulldown',
  'Overhead Press',
  'Lateral Raise',
  'Rear Delt Fly',
  'Lunge',
  'Leg Press',
  'Leg Curl',
  'Calf Raise',
  'Triceps Dip',
  'Triceps Pushdown',
  'Biceps Curl',
  'Hammer Curl',
  'Chest Fly',
  'Incline Bench',
  'Decline Bench',
  'Dumbbell Row',
  'Face Pull',
  'Cable Row',
  'Push-up',
  'Plank',
  'Russian Twist',
  'Hip Thrust',
  'Glute Bridge',
  'Farmer Carry',
  'Kettlebell Swing',
  'Good Morning',
  'Romanian Deadlift',
  'Step Up',
  'Seated Row',
  'Chest Press',
  'Arnold Press',
  'Reverse Fly',
  'Skull Crusher',
  'Incline Dumbbell Press',
];
