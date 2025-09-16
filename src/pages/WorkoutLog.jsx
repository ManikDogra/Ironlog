import { useState } from 'react';

export default function WorkoutLog() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const handleAdd = () => {
    if (!exercise || !sets || !reps) return;
    const newWorkout = { id: Date.now(), exercise, sets, reps };
    setWorkouts([...workouts, newWorkout]);
    setExercise('');
    setSets('');
    setReps('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
    <h2 className="text-2xl font-bold mb-4">Workout Log</h2>

      <input
        type="text"
        placeholder="Exercise"
        className="border p-2 w-full mb-2"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      />
      <input
        type="number"
        placeholder="Sets"
        className="border p-2 w-full mb-2"
        value={sets}
        onChange={(e) => setSets(e.target.value)}
      />
      <input
        type="number"
        placeholder="Reps"
        className="border p-2 w-full mb-4"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Workout
      </button>

      <ul className="mt-6">
        {workouts.map((workout) => (
          <li
            key={workout.id}
            className="border-b py-2 text-gray-700 flex justify-between"
          >
            <span>{workout.exercise}</span>
            <span>{workout.sets}x{workout.reps}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
