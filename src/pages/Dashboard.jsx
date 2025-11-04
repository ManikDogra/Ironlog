import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";
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
  const { profile, logout, token } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newWorkout, setNewWorkout] = useState({
    name: "",
    date: "",
    exercises: [],
  });

  // Fetch workouts on mount
  useEffect(() => {
    if (token) {
      fetchWorkouts();
    }
  }, [token]);

  const fetchWorkouts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data);
      }
    } catch (err) {
      console.error("Fetch workouts error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate active streak based on daily logins stored in profile.loginDates
  const calculateStreak = () => {
    const loginDates = (profile && profile.loginDates) || [];
    if (!loginDates || loginDates.length === 0) return 0;

    // Build a set of date strings for quick lookup
    const dateSet = new Set(
      loginDates.map((d) => new Date(d).toDateString())
    );

    let streak = 0;
    let currentDate = new Date();

    while (true) {
      // Skip Sundays (rest day) — do not break the streak when encountering Sunday
      if (currentDate.getDay() === 0) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }

      const dStr = currentDate.toDateString();
      if (dateSet.has(dStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // If user missed a non-Sunday day, streak stops
        break;
      }
    }

    return streak;
  };

  const stats = [
    { title: "Total Workouts", value: 0 },
    { title: "Personal Records", value: 8 },
    { title: "Current Weight", value: `${profile?.weight || 0} kg` },
  { title: "Active Streak", value: `${calculateStreak()} days` },
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

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkout.name || !newWorkout.date) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newWorkout.name,
          date: newWorkout.date,
          exercises: [],
        }),
      });
      if (res.ok) {
        const addedWorkout = await res.json();
        setWorkouts([addedWorkout, ...workouts]);
        setNewWorkout({ name: "", date: "", exercises: [] });
        setShowModal(false);
      }
    } catch (err) {
      console.error("Add workout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 flex justify-between items-center px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold tracking-wide">IRONLOG</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
          >
            <User className="w-5 h-5" />
            <span>{profile?.name || "User"}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
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
      </motion.div>
    </div>
  );
}
