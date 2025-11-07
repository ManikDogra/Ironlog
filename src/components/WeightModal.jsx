// src/components/WeightModal.jsx
import React, { useState } from "react";

export default function WeightModal({ open, onSubmit, onClose }) {
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    const w = Number(weight);
    if (!weight || Number.isNaN(w) || w <= 0) {
      setError("Weight must be a positive number");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(w);
      setWeight("");
    } catch (err) {
      console.error(err);
      setError("Failed to save weight");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* prevent clicks on backdrop from reaching underlying elements */}
      <div
        className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-8"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-medium mb-4">Add Today's Weight</h2>
        <p className="text-sm text-gray-600 mb-4">Enter your current weight to track your progress.</p>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => { setWeight(e.target.value); setError(""); }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="e.g., 75.5"
            aria-label="Weight (kg)"
            className="w-full px-3 py-2 border rounded text-black placeholder-gray-400"
          />
          {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
        </div>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50" disabled={loading}>
            Skip
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
