import React from 'react';

export default function AppModal({ open, title, children, onCancel, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', loading = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel} />
      <div className="bg-white rounded-lg shadow-lg z-10 max-w-lg w-full p-6">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <div className="mb-4 text-sm text-gray-700">{children}</div>
        <div className="flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded">{cancelText}</button>
          <button onClick={onConfirm} disabled={loading} className={`px-4 py-2 rounded ${loading ? 'bg-gray-400 text-white' : 'bg-black text-white'}`}>
            {loading ? 'Working...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
