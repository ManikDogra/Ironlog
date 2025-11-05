import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppModal from "../components/AppModal";
import PageHeader from "../components/PageHeader";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EmptyState from "../components/EmptyState";
import { Calendar } from "lucide-react";

export default function TodayWorkout() {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/workouts/today`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setWorkout(data);
        } else if (res.status === 404) {
          setWorkout(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleExerciseComplete = async (idx) => {
    if (!workout) return;
    const newExercises = (workout.exercises || []).map((ex, i) =>
      i === idx ? { ...ex, completed: !ex.completed } : ex
    );
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/workouts/${workout._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ exercises: newExercises }),
        }
      );
      if (res.ok) {
        const body = await res.json();
        setWorkout(body);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markWorkoutComplete = async () => {
    if (!workout) return;
    setIsCompleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/workouts/${workout._id}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const completedId = workout._id;
        const completedName = workout.name;
        setWorkout(null);
        setStatus("Workout completed — saved to history");
        setTimeout(
          () =>
            navigate("/dashboard", {
              state: {
                completedWorkoutId: completedId,
                completedWorkoutName: completedName,
              },
            }),
          400
        );
      } else {
        setStatus("Failed to complete workout");
      }
    } catch (e) {
      console.error(e);
      setStatus("Server error");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    await markWorkoutComplete();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 dark:text-gray-100">
        Loading...
      </div>
    );

  if (!workout)
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header />
        <main className="flex-grow">
          <div className="min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
              <EmptyState
                icon={Calendar}
                title="No Workout Today"
                description="You haven't logged a workout for today yet. Start a new workout to get moving!"
                action={{
                  label: "Create Workout",
                  onClick: () => (window.location.href = "/workout"),
                }}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />
      <main className="flex-grow">
        <div className="min-h-screen p-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <PageHeader
              title={
                workout.name +
                " — " +
                new Date(workout.date).toLocaleDateString()
              }
            />

            <div className="space-y-3">
              {(workout.exercises || []).map((ex, idx) => (
                <div
                  key={idx}
                  className={`${
                    ex.completed
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                      : "bg-white dark:bg-gray-800 dark:border-gray-700"
                  } border rounded p-3 flex justify-between items-center`}
                >
                  <div>
                    <div className="font-medium">{ex.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {ex.sets} sets × {ex.reps} reps • {ex.weight} kg
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => toggleExerciseComplete(idx)}
                      className={`px-3 py-1 rounded ${
                        ex.completed
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      {ex.completed ? "Completed" : "Mark Complete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end items-center space-x-3">
              {status && (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {status}
                </div>
              )}
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Mark workout as complete
              </button>
            </div>
          </div>

          <AppModal
            open={showConfirm}
            title="Confirm"
            onCancel={() => setShowConfirm(false)}
            onConfirm={handleConfirm}
            loading={isCompleting}
            confirmText="Yes, complete"
            cancelText="Cancel"
          >
            Are you sure you want to mark this workout as complete? This will
            move it to your History.
          </AppModal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
