import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [workouts, setWorkouts] = useState([
    { name: "Push Day", date: "Oct 21, 2025", exercises: 5 },
    { name: "Pull Day", date: "Oct 20, 2025", exercises: 6 },
    { name: "Leg Day", date: "Oct 18, 2025", exercises: 7 },
  ]);

  const [newWorkout, setNewWorkout] = useState({
    name: "",
    date: "",
    exercises: "",
  });

  const stats = [
    { title: "Total Workouts", value: workouts.length },
    { title: "Personal Records", value: 8 },
    { title: "Current Weight", value: "72 kg" },
    { title: "Active Streak", value: "5 days" },
  ];

  const progressData = [
    { day: "Mon", weight: 71 },
    { day: "Tue", weight: 72 },
    { day: "Wed", weight: 71.8 },
    { day: "Thu", weight: 71.6 },
    { day: "Fri", weight: 72.3 },
    { day: "Sat", weight: 72 },
    { day: "Sun", weight: 71.7 },
  ];

  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (!newWorkout.name || !newWorkout.date) return;
    setWorkouts([newWorkout, ...workouts]);
    setNewWorkout({ name: "", date: "", exercises: "" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 flex justify-between items-center px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold tracking-wide">IRONLOG</h1>
        <Link
          to="/login"
          className="text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-black hover:text-white transition"
        >
          Logout
        </Link>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 max-w-6xl mx-auto space-y-8"
      >
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100 text-center"
            >
              <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-3">Progress Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#000000"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Workouts */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Workouts</h2>
            <button
              onClick={() => setShowModal(true)}
              className="border border-black text-black px-3 py-1.5 rounded-md hover:bg-black hover:text-white transition"
            >
              ➕ Add Workout
            </button>
          </div>
          <div className="space-y-3">
            {workouts.map((workout, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0"
              >
                <div>
                  <h3 className="font-medium">{workout.name}</h3>
                  <p className="text-gray-500 text-sm">{workout.date}</p>
                </div>
                <span className="text-gray-600 text-sm">
                  {workout.exercises || 0} exercises
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Add Workout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-8 w-11/12 max-w-md shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Add New Workout
            </h2>
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Workout Name
                </label>
                <input
                  type="text"
                  value={newWorkout.name}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  value={newWorkout.date}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Exercises Count
                </label>
                <input
                  type="number"
                  value={newWorkout.exercises}
                  onChange={(e) =>
                    setNewWorkout({
                      ...newWorkout,
                      exercises: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none"
                  placeholder="e.g. 5"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                >
                  Add
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
