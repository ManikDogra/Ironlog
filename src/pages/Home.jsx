import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Left Image Section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex w-1/2 items-center justify-center bg-black"
      >
        <img
          src="https://images.unsplash.com/photo-1579758629934-095eddd6ab15?q=80&w=1470"
          alt="Gym motivation"
          className="h-full w-full object-cover opacity-80"
        />
      </motion.div>

      {/* Right Dashboard Section */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 p-8"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back 💪</h2>
          <p className="text-center text-gray-500 mb-6">
            Track your progress, review workouts, and stay consistent.
          </p>

          {/* Dashboard Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/add-workout")}
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Add New Workout
            </button>
            <button
              onClick={() => navigate("/progress")}
              className="w-full py-2 bg-gray-100 font-semibold text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              View Progress
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="w-full py-2 bg-gray-100 font-semibold text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Account Settings
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-500 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
