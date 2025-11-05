import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProfilePage() {
  const { profile, setProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(profile?.name || "");
  const [weight, setWeight] = useState(profile?.weight || "");
  const [gender, setGender] = useState(profile?.gender || "");
  const [goal, setGoal] = useState(profile?.goal || "");
  const [age, setAge] = useState(profile?.age || "");
  const [height, setHeight] = useState(profile?.height || "");
  const [status, setStatus] = useState("");

  const handleEdit = () => {
    setEditMode(true);
    setName(profile?.name || "");
    setWeight(profile?.weight || "");
    setGender(profile?.gender || "");
    setGoal(profile?.goal || "");
    setAge(profile?.age || "");
    setHeight(profile?.height || "");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, weight: Number(weight), gender, goal, age: Number(age), height: Number(height) }),
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        setProfile(null);
        setStatus("Session expired, please login again.");
        return;
      }
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (res.ok) {
        setProfile(data.profile || null);
        setStatus("saved");
        setEditMode(false);
        navigate("/dashboard");
      } else {
        setStatus(data.error || "Error saving profile");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setStatus("");
  };

  if (!isAuthenticated) return <div className="p-8">Please login to view your profile.</div>;

  if (!profile) return <div className="p-8">No profile found. Please set up your profile.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow">
      <div className="p-8">
      <div className="max-w-xl bg-white border border-gray-200 rounded p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <PageHeader title={"Your Profile"} />
          {!editMode && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Edit
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                <input
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Height (cm)</label>
                <input
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Age</label>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Goal</label>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Save
              </button>
            </div>
            {status && <div className="text-sm text-green-600">{status === "saved" ? "Profile updated!" : status}</div>}
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-medium">{profile.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Age</div>
              <div className="font-medium">{profile.age}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Weight (kg)</div>
              <div className="font-medium">{profile.weight}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Height (cm)</div>
              <div className="font-medium">{profile.height}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Gender</div>
              <div className="font-medium">{profile.gender}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Goal</div>
              <div className="font-medium">{profile.goal}</div>
            </div>
          </div>
        )}
      </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
