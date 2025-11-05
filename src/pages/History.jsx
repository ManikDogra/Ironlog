import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import AppModal from '../components/AppModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import { History as HistoryIcon } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, workoutId: null });
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/workouts/history?page=1&limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setHistory((data && data.items) || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const confirmDelete = (workoutId) => {
    setConfirmModal({ open: true, type: 'single', workoutId });
  };

  const confirmClearAll = () => {
    setConfirmModal({ open: true, type: 'all', workoutId: null });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      if (confirmModal.type === 'single') {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/workouts/${confirmModal.workoutId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setHistory(history.filter(w => w._id !== confirmModal.workoutId));
          setSelected(null);
        }
      } else if (confirmModal.type === 'all') {
        // Delete each workout one by one
        const deletePromises = history.map(w =>
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/workouts/${w._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        );
        await Promise.all(deletePromises);
        setHistory([]);
        setSelected(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setConfirmModal({ open: false, type: null, workoutId: null });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <PageHeader title={"Workout History"} />
              {history.length > 0 && (
                <button
                  onClick={confirmClearAll}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Clear History"}
                </button>
              )}
            </div>
            {history.length === 0 && (
              <EmptyState
                icon={HistoryIcon}
                title="No Workouts Yet"
                description="Start your fitness journey by logging your first workout. Track your progress and stay consistent!"
                action={{ label: "Add Workout", onClick: () => window.location.href = "/workout" }}
              />
            )}
            <div className="space-y-3">
              {history.map((w) => (
                <div key={w._id} className="border rounded p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{w.name}</div>
                    <div className="text-sm text-gray-600">{new Date(w.completedAt || w.date).toLocaleString()}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => setSelected(w)} className="px-3 py-1 border rounded hover:bg-gray-50">View</button>
                    <button
                      onClick={() => confirmDelete(w._id)}
                      disabled={deleting}
                      className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-2">{selected.name}</h3>
              <div className="text-sm text-gray-600 mb-4">{new Date(selected.completedAt || selected.date).toLocaleString()}</div>
              <div className="space-y-3">
                {(selected.exercises || []).map((ex, idx) => (
                  <div key={idx} className="border rounded p-3">
                    <div className="font-medium">{ex.name}</div>
                    <div className="text-sm text-gray-600">{ex.sets} sets × {ex.reps} reps • {ex.weight} kg</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded">Close</button>
                <button
                  onClick={() => confirmDelete(selected._id)}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Workout"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Confirmation modal */}
        <AppModal
          open={confirmModal.open}
          title={confirmModal.type === 'all' ? 'Clear All Workouts?' : 'Delete Workout?'}
          onCancel={() => setConfirmModal({ open: false, type: null, workoutId: null })}
          onConfirm={handleConfirmDelete}
          confirmText={confirmModal.type === 'all' ? 'Delete All' : 'Delete'}
          cancelText="Cancel"
        >
          <p className="text-gray-600">
            {confirmModal.type === 'all'
              ? 'This will delete all completed workouts. This action cannot be undone.'
              : 'This will delete this workout. This action cannot be undone.'}
          </p>
        </AppModal>
      </main>
      <Footer />
    </div>
  );
}
