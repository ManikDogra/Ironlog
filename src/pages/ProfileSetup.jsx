import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import { motion } from "framer-motion";

export default function ProfileSetup() {
  const { profile, setProfile, isAuthenticated, loading } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [weight, setWeight] = useState(profile?.weight || "");
  const [gender, setGender] = useState(profile?.gender || "");
  const [goal, setGoal] = useState(profile?.goal || "");
  const [age, setAge] = useState(profile?.age || "");
  const [height, setHeight] = useState(profile?.height || "");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  // Show loading while checking auth/profile
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    // if profile already exists, prefill fields
    if (profile) {
      setName(profile.name || "");
      setWeight(profile.weight || "");
      setGender(profile.gender || "");
      setGoal(profile.goal || "");
      setAge(profile.age || "");
      setHeight(profile.height || "");
    }
  }, [profile]);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/profile`, {
        method: profile ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, weight: Number(weight), gender, goal, age: Number(age), height: Number(height) }),
      });
      if (res.status === 401) {
        // token expired/invalid — force logout
        localStorage.removeItem("token");
        setProfile(null);
        setStatus("Session expired, please login again.");
        setTimeout(() => (window.location.href = "/login"), 1000);
        return;
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (res.ok) {
        setProfile(data.profile || null);
        setStatus("saved");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setStatus(data.error || "Error saving profile");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 transition-colors"
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.1 }}
        className="w-full max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-medium mb-6 text-gray-900 dark:text-white">Set up your profile</h2>
        <form className="space-y-6" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full name</label>
            <input 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
                       text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                       transition-colors" 
              placeholder="Enter your name"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
              <input 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
                         text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                         transition-colors" 
                placeholder="Enter weight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Height (cm)</label>
              <input 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)} 
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
                         text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                         transition-colors" 
                placeholder="Enter height"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age</label>
              <input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
                         text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                         transition-colors" 
                placeholder="Enter age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
                         text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                         transition-colors"
              >
                <option value="" className="dark:bg-gray-700">Select</option>
                <option value="male" className="dark:bg-gray-700">Male</option>
                <option value="female" className="dark:bg-gray-700">Female</option>
                <option value="other" className="dark:bg-gray-700">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goal</label>
            <input 
              value={goal} 
              onChange={(e) => setGoal(e.target.value)} 
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
                       text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                       transition-colors" 
              placeholder="What's your fitness goal?"
            />
          </div>

          <div className="flex flex-col items-center pt-4">
            {status && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`mb-4 px-4 py-2 rounded-lg text-sm ${
                  status === "saved" 
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200" 
                    : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
                }`}
              >
                {status === "saved" ? "Profile saved ✅" : status}
              </motion.div>
            )}
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                       text-white font-medium rounded-lg shadow-sm hover:shadow-md
                       transform transition-all duration-200 hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Save Profile
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
