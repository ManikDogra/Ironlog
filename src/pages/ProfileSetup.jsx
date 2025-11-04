import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/profile`, {
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
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-medium mb-4">Set up your profile</h2>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
              <input value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Height (cm)</label>
              <input value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Age</label>
              <input value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 border rounded">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Goal</label>
            <input value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-600 mb-2">{status === "saved" ? "Profile saved ✅" : status}</div>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
