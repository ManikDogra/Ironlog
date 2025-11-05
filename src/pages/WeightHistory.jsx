// src/pages/WeightHistory.jsx
import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import AppModal from "../components/AppModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EmptyState from "../components/EmptyState";
import { TrendingUp } from "lucide-react";

export default function WeightHistory() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, entryDate: null });
  const limit = 20;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/weight/history?page=${page}&limit=${limit}&days=365`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setEntries((data && data.items) || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const handleDelete = async (date) => {
    setConfirmModal({ open: true, entryDate: date });
  };

  const handleConfirmDelete = async () => {
    const date = confirmModal.entryDate;
    setDeleting(true);
    try {
      const dateStr = new Date(date).toISOString().slice(0, 10);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/weight/${dateStr}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        setEntries(entries.filter((e) => e.date !== date));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setConfirmModal({ open: false, entryDate: null });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 dark:text-gray-100">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />
      <main className="flex-grow">
        <div className="min-h-screen p-6">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <PageHeader title={"Weight History"} />

            {entries.length === 0 && (
              <EmptyState
                icon={TrendingUp}
                title="No Weight Entries"
                description="Start tracking your weight to monitor your progress. Log your weight daily on the dashboard!"
                action={{
                  label: "Go to Dashboard",
                  onClick: () => (window.location.href = "/dashboard"),
                }}
              />
            )}

            <div className="space-y-3">
              {entries.map((e) => (
                <div
                  key={e._id}
                  className="border rounded p-4 flex justify-between items-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <div className="font-medium">
                      {new Date(e.date).toLocaleDateString()}{" "}
                      {new Date(e.date).toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {e.weight} kg
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(e.date)}
                    disabled={deleting}
                    className="px-3 py-1 border border-red-300 text-red-600 dark:border-red-700 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation modal */}
          <AppModal
            open={confirmModal.open}
            title="Delete Weight Entry?"
            onCancel={() => setConfirmModal({ open: false, entryDate: null })}
            onConfirm={handleConfirmDelete}
            confirmText="Delete"
            cancelText="Cancel"
          >
            <p className="text-gray-600 dark:text-gray-300">
              This will delete this weight entry. This action cannot be undone.
            </p>
          </AppModal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
