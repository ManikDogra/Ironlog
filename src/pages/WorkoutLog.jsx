import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { workoutTemplates, globalExercises } from "../data/workoutTemplates";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function WorkoutLog() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format (local timezone)
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [exercises, setExercises] = useState([]);
  const [templateQuery, setTemplateQuery] = useState("");
  const [templateOpen, setTemplateOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSets, setEditSets] = useState("");
  const [editReps, setEditReps] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const exerciseSuggestions = useMemo(() => {
    const q = (exerciseName || "").trim().toLowerCase();
    if (!q && !exerciseOpen) return [];
    if (!q) return globalExercises.slice(0, 8);
    return globalExercises.filter((e) => e.toLowerCase().includes(q)).slice(0, 8);
  }, [exerciseName, exerciseOpen]);

  const templateMatches = useMemo(() => {
    const q = (templateQuery || "").trim().toLowerCase();
    if (!q) return workoutTemplates;
    return workoutTemplates.filter((t) => t.name.toLowerCase().includes(q));
  }, [templateQuery]);

  const applyTemplate = (t) => {
    setName(t.name);
    setExercises(
      t.exercises.map((ex) => ({
        id: Date.now() + Math.random(),
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || 0,
      }))
    );
    setTemplateOpen(false);
    setTemplateQuery("");
  };

  const addExercise = () => {
    if (!exerciseName || typeof exerciseName !== "string" || exerciseName.trim() === "") {
      setSaveStatus("Exercise name required");
      return;
    }
    const nameRegex = /^[A-Za-z\s\-]+$/;
    if (!nameRegex.test(exerciseName.trim())) {
      setSaveStatus("Exercise names can only contain letters, spaces, and hyphens");
      return;
    }
    const s = Number(sets);
    const r = Number(reps);
    const w = Number(weight);
    if (Number.isNaN(s) || s < 0 || Number.isNaN(r) || r < 0 || Number.isNaN(w) || w < 0) {
      setSaveStatus("Sets, reps and weight must be non-negative numbers");
      return;
    }
    setExercises([
      ...exercises,
      { id: Date.now(), name: exerciseName.trim(), sets: s, reps: r, weight: w },
    ]);
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
  };

  const startEdit = (ex) => {
    setEditingId(ex.id);
    setEditName(ex.name);
    setEditSets(ex.sets);
    setEditReps(ex.reps);
    setEditWeight(ex.weight);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSets("");
    setEditReps("");
    setEditWeight("");
  };

  const saveEdit = (id) => {
    if (!editName || typeof editName !== "string" || editName.trim() === "") {
      setSaveStatus("Exercise name required");
      return;
    }
    const nameRegex = /^[A-Za-z\s\-]+$/;
    if (!nameRegex.test(editName.trim())) {
      setSaveStatus("Exercise names can only contain letters, spaces, and hyphens");
      return;
    }
    const s = Number(editSets);
    const r = Number(editReps);
    const w = Number(editWeight);
    if (Number.isNaN(s) || s < 0 || Number.isNaN(r) || r < 0 || Number.isNaN(w) || w < 0) {
      setSaveStatus("Sets, reps and weight must be non-negative numbers");
      return;
    }
    setExercises(
      exercises.map((ex) =>
        ex.id === id ? { ...ex, name: editName.trim(), sets: s, reps: r, weight: w } : ex
      )
    );
    cancelEdit();
  };

  const handleSave = async () => {
    const nameVal = (name || "").trim();
    if (!nameVal) {
      setNameError("Workout name is required");
      return;
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(nameVal)) {
      setNameError("Name cannot include numbers or symbols");
      return;
    }
    if (!Array.isArray(exercises) || exercises.length === 0) {
      setSaveStatus("Add at least one exercise");
      return;
    }
    for (const ex of exercises) {
      if (!ex.name || typeof ex.name !== "string" || ex.name.trim() === "") {
        setSaveStatus("Each exercise must have a name");
        return;
      }
      const nameRegex = /^[A-Za-z\s\-]+$/;
      if (!nameRegex.test(ex.name.trim())) {
        setSaveStatus("Exercise names can only contain letters, spaces, and hyphens");
        return;
      }
      const s = Number(ex.sets);
      const r = Number(ex.reps);
      const w = Number(ex.weight);
      if (Number.isNaN(s) || s < 0 || Number.isNaN(r) || r < 0 || Number.isNaN(w) || w < 0) {
        setSaveStatus("Sets, reps and weight must be non-negative numbers");
        return;
      }
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "/api"}/workouts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: nameVal,
            exercises: exercises.map((ex) => ({
              name: ex.name.trim(),
              sets: Number(ex.sets),
              reps: Number(ex.reps),
              weight: Number(ex.weight),
            })),
            date,
          }),
        }
      );
      if (res.ok) {
        setSaveStatus("Workout saved successfully");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setSaveStatus("Failed to save workout");
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("Server error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <div className="min-h-screen p-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300">
            <PageHeader title={"Add Workout"} />
            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Workout name
              </label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
              />
              {nameError && <div className="text-sm text-red-500 mt-1">{nameError}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Choose a template
              </label>
              <div className="relative">
                <input
                  value={templateQuery}
                  onFocus={() => setTemplateOpen(true)}
                  onChange={(e) => setTemplateQuery(e.target.value)}
                  placeholder="Search templates (Back, Legs...)"
                  className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                />
                {templateOpen && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow max-h-40 overflow-auto">
                    {templateMatches.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => applyTemplate(t)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
              />
            </div>

            <div className="mb-4 border-t dark:border-gray-700 pt-4">
              <h3 className="font-semibold mb-2">Exercises</h3>
              <div className="grid grid-cols-4 gap-2 mb-2 relative">
                <input
                  placeholder="Exercise"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  onFocus={() => setExerciseOpen(true)}
                  onBlur={() => setTimeout(() => setExerciseOpen(false), 150)}
                  className="px-2 py-1 border rounded col-span-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                />
                {exerciseOpen && exerciseSuggestions.length > 0 && (
                  <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow max-h-40 overflow-auto z-20 col-span-2 w-1/2">
                    {exerciseSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onMouseDown={() => {
                          setExerciseName(s);
                          setExerciseOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <input
                  placeholder="Sets"
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="px-2 py-1 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                />
                <input
                  placeholder="Reps"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="px-2 py-1 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                />
                <input
                  placeholder="Weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="px-2 py-1 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition col-span-1"
                />
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={addExercise}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
                >
                  Add Exercise
                </button>
              </div>

              <div className="space-y-3">
                {exercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded p-3 flex justify-between items-center transition"
                  >
                    <div>
                      {editingId === ex.id ? (
                        <div className="space-y-2">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-2 py-1 border rounded w-64 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 transition"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              min="0"
                              value={editSets}
                              onChange={(e) => setEditSets(e.target.value)}
                              className="px-2 py-1 border rounded w-20 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 transition"
                            />
                            <input
                              type="number"
                              min="0"
                              value={editReps}
                              onChange={(e) => setEditReps(e.target.value)}
                              className="px-2 py-1 border rounded w-20 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 transition"
                            />
                            <input
                              type="number"
                              min="0"
                              value={editWeight}
                              onChange={(e) => setEditWeight(e.target.value)}
                              className="px-2 py-1 border rounded w-28 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 transition"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium">{ex.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {ex.sets} sets × {ex.reps} reps • {ex.weight} kg
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {editingId === ex.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => saveEdit(ex.id)}
                            className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-2 py-1 border rounded dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(ex)}
                          className="px-2 py-1 border rounded dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {saveStatus && (
                <div
                  className={`px-4 py-2 rounded ${
                    saveStatus.toLowerCase().includes("success")
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }`}
                >
                  {saveStatus}
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 border rounded dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
                >
                  Save Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
