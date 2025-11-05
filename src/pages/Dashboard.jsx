import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppModal from "../components/AppModal";
import WeightModal from "../components/WeightModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { User, PlusSquare, Calendar } from "lucide-react";
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
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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

  // Fetch workouts on mount
  useEffect(() => {
    if (token) {
      fetchWorkouts();
      fetchTodayWorkout();
      fetchRecentCompleted();
      fetchPersonalRecords();
      fetchWeightData();
      checkAndShowWeightModal();
    }
    // If profile exists but not completed, show the required setup modal
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

  // Check if navigated here after completing a workout and show undo toast
  useEffect(() => {
    if (location && location.state && location.state.completedWorkoutId) {
      setJustCompletedId(location.state.completedWorkoutId);
      setJustCompletedName(location.state.completedWorkoutName || "Workout");
      setUndoToastOpen(true);
      // Clear location.state to avoid repeat on refresh/navigation
      try {
        window.history.replaceState({}, document.title);
      } catch (e) {
        // ignore
      }
    }
  }, [location]);

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

  const fetchPersonalRecords = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/workouts/prs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return setPrList([]);
      const data = await res.json();
      // server returns array of PRs
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/workouts/pr/${encodeURIComponent(exerciseName)}?page=1&limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setPrDrillItems([]);
        setPrDrillOpen(true);
        return;
      }
      const data = await res.json();
      const items = (data && data.items) || [];
      setPrDrillItems(items.map(it => ({ date: it.date, workoutName: it.workoutName, weight: it.weight, sets: it.sets, reps: it.reps })));
      setPrDrillOpen(true);
    } catch (err) {
      console.error('PR drill error:', err);
      setPrDrillItems([]);
      setPrDrillOpen(true);
    } finally {
      setPrDrillLoading(false);
    }
  };

  const fetchTodayWorkout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/workouts/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTodaysWorkout(data);
        setTodaysCompleted(false);
        return;
      }
      // if 404, clear today's workout
      setTodaysWorkout(null);
    } catch (err) {
      console.error("Fetch today's workout error:", err);
      setTodaysWorkout(null);
    }
  };

  const fetchRecentCompleted = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/workouts/history?page=1&limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const latest = data && data.items && data.items.length ? data.items[0] : null;
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
    { title: "Personal Records", value: prList.length },
    { title: "Current Weight", value: `${profile?.weight || 0} kg` },
    { title: "Active Streak", value: `${calculateStreak()} days` },
  ];

  // progressData is now fetched from backend and state

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

  const handleUndo = async () => {
    if (!justCompletedId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/workouts/${justCompletedId}/undo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.ok) {
        // refresh dashboard state
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

  const fetchWeightData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/weight/history?days=7&limit=7`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const items = (data && data.items) || [];
        // Sort by date ascending and format for chart (last 7 days)
        const sorted = items.sort((a, b) => new Date(a.date) - new Date(b.date));
        const formatted = sorted.map(e => {
          const d = new Date(e.date);
          const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
          return { day: dayName, weight: e.weight, date: e.date };
        });
        setProgressData(formatted);
      }
    } catch (err) {
      console.error("Fetch weight data error:", err);
    }
  };

  const checkAndShowWeightModal = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/weight/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // If 404, user hasn't entered weight today, show modal
      if (res.status === 404) {
        setWeightModalOpen(true);
      }
    } catch (err) {
      console.error("Check weight error:", err);
    }
  };

  const handleWeightSubmit = async (weight) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/weight`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ weight }),
      });
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/profile`, {
        method: profile ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: psName, weight: Number(psWeight), gender: psGender, goal: psGoal, age: Number(psAge), height: Number(psHeight) }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (res.ok) {
        // update auth context profile so UI updates and modal closes
        setProfile(data.profile || null);
        setPsStatus("saved");
        setTimeout(() => setShowModal(false), 500);
      } else {
        setPsStatus(data.error || "Error saving profile");
      }
    } catch (err) {
      console.error(err);
      setPsStatus("Server error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black font-sans">
      <Header />
      <main className="flex-grow">
        <>
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 max-w-6xl mx-auto space-y-8"
      >
        {/* Quick actions (Add workout + History placeholder) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/workout" className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded hover:bg-gray-100">
              <PlusSquare className="w-5 h-5" />
              <span className="text-sm font-medium">Add Workout</span>
            </Link>
            {/* show today's workout state inline on dashboard */}
            {todaysWorkout ? (
              <Link to="/today-workout" className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded hover:bg-gray-100">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Today's Workout</span>
              </Link>
            ) : todaysCompleted ? (
              <Link to="/history" className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-100 rounded bg-gray-100 text-gray-500 cursor-default">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Today's workout completed — View History</span>
              </Link>
            ) : (
              <Link to="/workout" className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded hover:bg-gray-100">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">No workout today</span>
              </Link>
            )}
          </div>
          <div>
            <Link to="/history" className="text-sm text-gray-500">History</Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`bg-white rounded-xl shadow-md p-5 border border-gray-100 text-center ${stat.title === 'Personal Records' ? 'cursor-pointer' : ''}`}
              onClick={() => { if (stat.title === 'Personal Records') setPrModalOpen(true); }}
              role={stat.title === 'Personal Records' ? 'button' : undefined}
            >
              <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Personal Records modal */}
      <AppModal open={prModalOpen} title={`Personal Records (${prList.length})`} onCancel={() => setPrModalOpen(false)} onConfirm={() => setPrModalOpen(false)} confirmText="Close" cancelText="">
        {prList.length === 0 ? (
          <div className="text-sm text-gray-600">No personal records yet.</div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-auto">
            {prList.map((p, i) => (
              <button key={i} onClick={() => openPrDrill(p.exercise)} className="w-full text-left border rounded p-3 hover:bg-gray-50">
                <div className="font-medium">{p.exercise}</div>
                <div className="text-sm text-gray-700">PR: <span className="font-semibold">{p.weight} kg</span> — {p.sets} sets × {p.reps} reps</div>
                <div className="text-sm text-gray-500">{new Date(p.date).toLocaleString()} • {p.workoutName}</div>
              </button>
            ))}
          </div>
        )}
      </AppModal>

      {/* PR drill-down modal: shows every occurrence of a selected exercise */}
      <AppModal open={prDrillOpen} title={prDrillExercise ? `History — ${prDrillExercise}` : 'History'} onCancel={() => setPrDrillOpen(false)} onConfirm={() => setPrDrillOpen(false)} confirmText="Close" cancelText="">
        {prDrillLoading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : prDrillItems.length === 0 ? (
          <div className="text-sm text-gray-600">No entries found for this exercise.</div>
        ) : (
          <div className="space-y-3 max-h-72 overflow-auto">
            {prDrillItems.map((it, idx) => (
              <div key={idx} className="border rounded p-3">
                <div className="font-medium">{it.workoutName}</div>
                <div className="text-sm text-gray-700">{it.weight} kg — {it.sets} sets × {it.reps} reps</div>
                <div className="text-sm text-gray-500">{new Date(it.date).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </AppModal>

        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Progress Overview</h2>
            <Link to="/weight-history" className="text-sm text-gray-500 hover:text-gray-700">Weight History</Link>
          </div>
          {progressData.length > 0 ? (
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
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">No weight data yet. Add your weight to see the chart.</div>
          )}
        </motion.div>
      {/* Weight modal (shown on first login of day if no weight entered) */}
      <WeightModal open={weightModalOpen} onSubmit={handleWeightSubmit} onClose={() => setWeightModalOpen(false)} />
      {/* Profile setup modal (non-dismissible) shown only when profile not completed */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-medium mb-4">Set up your profile</h2>
            <form className="space-y-4" onSubmit={submitProfileSetup}>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full name</label>
                <input required value={psName} onChange={(e) => setPsName(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                  <input value={psWeight} onChange={(e) => setPsWeight(e.target.value)} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Height (cm)</label>
                  <input value={psHeight} onChange={(e) => setPsHeight(e.target.value)} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Age</label>
                  <input value={psAge} onChange={(e) => setPsAge(e.target.value)} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gender</label>
                  <select value={psGender} onChange={(e) => setPsGender(e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Goal</label>
                <input value={psGoal} onChange={(e) => setPsGoal(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>

              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">{psStatus === "saved" ? "Profile saved ✅" : psStatus}</div>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <UndoToast open={undoToastOpen} message={`${justCompletedName} completed`} onUndo={handleUndo} onClose={closeUndo} />
        </>
      </main>
      <Footer />
    </div>
  );
}
