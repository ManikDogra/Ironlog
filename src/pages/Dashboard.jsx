import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppModal from "../components/AppModal";
import WeightModal from "../components/WeightModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PlusSquare, Calendar, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import UndoToast from "../components/UndoToast";

export default function Dashboard() {
  const { profile, logout, setProfile } = useAuth();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
  const [psName, setPsName] = useState("");
  const [psWeight, setPsWeight] = useState("");
  const [psGender, setPsGender] = useState("");
  const [psGoal, setPsGoal] = useState("");
  const [psAge, setPsAge] = useState("");
  const [psHeight, setPsHeight] = useState("");
  const [psStatus, setPsStatus] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [todaysCompleted, setTodaysCompleted] = useState(false);
  const [prList, setPrList] = useState([]);
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [prDrillOpen, setPrDrillOpen] = useState(false);
  const [prDrillExercise, setPrDrillExercise] = useState("");
  const [prDrillItems, setPrDrillItems] = useState([]);
  const [prDrillLoading, setPrDrillLoading] = useState(false);
  const location = useLocation();
  const [undoToastOpen, setUndoToastOpen] = useState(false);
  const [justCompletedId, setJustCompletedId] = useState(null);
  const [justCompletedName, setJustCompletedName] = useState("");
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [progressData, setProgressData] = useState([]);

  const [newWorkout, setNewWorkout] = useState({
    name: "",
    date: "",
    exercises: [],
  });

const [isDark, setIsDark] = useState(() => {
  // Always read the latest saved theme from localStorage
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  const currentTheme = localStorage.getItem("theme");
  document.documentElement.classList.toggle("dark", currentTheme === "dark");
}, []);

// Listen for theme changes triggered from Header
useEffect(() => {
  const handleStorageChange = () => {
    const currentTheme = localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
    setIsDark(currentTheme === "dark");
  };
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);


  useEffect(() => {
    if (token) {
      fetchWorkouts();
      fetchTodayWorkout();
      fetchRecentCompleted();
      fetchPersonalRecords();
      fetchWeightData();
      checkAndShowWeightModal();
    }
    if (profile && profile.profileCompleted !== true) {
      setPsName(profile.name || "");
      setPsWeight(profile.weight || "");
      setPsGender(profile.gender || "");
      setPsGoal(profile.goal || "");
      setPsAge(profile.age || "");
      setPsHeight(profile.height || "");
      setShowModal(true);
    }
  }, [token]);

  useEffect(() => {
    if (location && location.state && location.state.completedWorkoutId) {
      setJustCompletedId(location.state.completedWorkoutId);
      setJustCompletedName(location.state.completedWorkoutName || "Workout");
      setUndoToastOpen(true);
      try {
        window.history.replaceState({}, document.title);
      } catch (e) {}
    }
  }, [location]);

  const fetchWorkouts = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/workouts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  const fetchPersonalRecords = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/workouts/prs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return setPrList([]);
      const data = await res.json();
      setPrList(data || []);
    } catch (err) {
      console.error("Fetch PRs error:", err);
      setPrList([]);
    }
  };

  const openPrDrill = async (exerciseName) => {
    setPrDrillExercise(exerciseName);
    setPrDrillLoading(true);
    setPrDrillItems([]);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/workouts/pr/${encodeURIComponent(exerciseName)}?page=1&limit=200`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        setPrDrillItems([]);
        setPrDrillOpen(true);
        return;
      }
      const data = await res.json();
      const items = (data && data.items) || [];
      setPrDrillItems(
        items.map((it) => ({
          date: it.date,
          workoutName: it.workoutName,
          weight: it.weight,
          sets: it.sets,
          reps: it.reps,
        }))
      );
      setPrDrillOpen(true);
    } catch (err) {
      console.error("PR drill error:", err);
      setPrDrillItems([]);
      setPrDrillOpen(true);
    } finally {
      setPrDrillLoading(false);
    }
  };

  const fetchTodayWorkout = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/workouts/today`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setTodaysWorkout(data);
        setTodaysCompleted(false);
        return;
      }
      setTodaysWorkout(null);
    } catch (err) {
      console.error("Fetch today's workout error:", err);
      setTodaysWorkout(null);
    }
  };

  const fetchRecentCompleted = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/workouts/history?page=1&limit=1`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const latest =
          data && data.items && data.items.length ? data.items[0] : null;
        if (latest && latest.completedAt) {
          const completedDate = new Date(latest.completedAt);
          const today = new Date();
          if (
            completedDate.getFullYear() === today.getFullYear() &&
            completedDate.getMonth() === today.getMonth() &&
            completedDate.getDate() === today.getDate()
          ) {
            setTodaysCompleted(true);
            return;
          }
        }
      }
      setTodaysCompleted(false);
    } catch (err) {
      console.error("Fetch recent completed error:", err);
      setTodaysCompleted(false);
    }
  };

  const calculateStreak = () => {
    const loginDates = (profile && profile.loginDates) || [];
    if (!loginDates || loginDates.length === 0) return 0;
    const dateSet = new Set(loginDates.map((d) => new Date(d).toDateString()));
    let streak = 0;
    let currentDate = new Date();
    while (true) {
      if (currentDate.getDay() === 0) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      const dStr = currentDate.toDateString();
      if (dateSet.has(dStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const stats = [
    { title: "Personal Records", value: prList.length },
    { title: "Current Weight", value: `${profile?.weight || 0} kg` },
    { title: "Active Streak", value: `${calculateStreak()} days` },
  ];

  const fetchWeightData = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/weight/history?days=7&limit=7`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const items = (data && data.items) || [];
        const sorted = items.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        const formatted = sorted.map((e) => {
          const d = new Date(e.date);
          const formattedDate = d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          return { dateLabel: formattedDate, weight: e.weight, fullDate: e.date };
        });
        setProgressData(formatted);
      }
    } catch (err) {
      console.error("Fetch weight data error:", err);
    }
  };

  const handleWeightSubmit = async (weight) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/weight`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ weight }),
        }
      );
      if (res.ok) {
        setWeightModalOpen(false);
        await fetchWeightData();
      }
    } catch (err) {
      console.error("Submit weight error:", err);
      throw err;
    }
  };

  const submitProfileSetup = async (e) => {
    e.preventDefault();
    setPsStatus("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/profile`,
        {
          method: profile ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: psName,
            weight: Number(psWeight),
            gender: psGender,
            goal: psGoal,
            age: Number(psAge),
            height: Number(psHeight),
          }),
        }
      );
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (res.ok) {
        setProfile(data.profile || null);
        setPsStatus("saved");
        setTimeout(() => setShowModal(false), 500);
      } else setPsStatus(data.error || "Error saving profile");
    } catch (err) {
      console.error(err);
      setPsStatus("Server error");
    }
  };

  const checkAndShowWeightModal = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/weight/today`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 404) setWeightModalOpen(true);
    } catch (err) {
      console.error("Check weight error:", err);
    }
  };

  const handleUndo = async () => {
    if (!justCompletedId) return;
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/workouts/${justCompletedId}/undo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        await fetchTodayWorkout();
        await fetchRecentCompleted();
        setUndoToastOpen(false);
        setJustCompletedId(null);
      }
    } catch (err) {
      console.error("Undo error:", err);
    }
  };

  const closeUndo = () => {
    setUndoToastOpen(false);
    setJustCompletedId(null);
  };

  // ✅ UI SECTION START
  return (
    <div className="flex min-h-screen bg-gray-50 text-black dark:bg-gray-900 dark:text-white font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <Link
          to="/workout"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <PlusSquare className="w-5 h-5" />
          <span>Add Workout</span>
        </Link>

        <Link
          to="/today-workout"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <Calendar className="w-5 h-5" />
          <span>Today's Workout</span>
        </Link>

        <Link
          to="/history"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Workout History</span>
        </Link>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Header />

        <main className="flex-grow px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700 text-center ${
                    stat.title === "Personal Records" ? "cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (stat.title === "Personal Records")
                      setPrModalOpen(true);
                  }}
                  role={
                    stat.title === "Personal Records" ? "button" : undefined
                  }
                >
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Progress Overview Chart */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 w-full"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Progress Overview</h2>
                <Link
                  to="/weight-history"
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Weight History
                </Link>
              </div>
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="dateLabel" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) => ` ${label}`}
                      contentStyle={{
                        backgroundColor: isDark ? "#1f2937" : "#ffffff",
                        borderColor: isDark ? "#374151" : "#e5e7eb",
                        color: isDark ? "#f9fafb" : "#111827",
                        borderRadius: "8px",
                      }}
                      itemStyle={{
                        color: isDark ? "#f3f4f6" : "#111827",
                      }}
                      labelStyle={{
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="currentColor"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No weight data yet. Add your weight to see the chart.
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Modals */}
          <WeightModal
            open={weightModalOpen}
            onSubmit={handleWeightSubmit}
            onClose={() => setWeightModalOpen(false)}
          />
        </main>

        <Footer />
      </div>

      <UndoToast
        open={undoToastOpen}
        message={`${justCompletedName} completed`}
        onUndo={handleUndo}
        onClose={closeUndo}
      />
    </div>
  );
}
