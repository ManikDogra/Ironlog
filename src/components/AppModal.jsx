import React from 'react';

export default function AppModal({
  open,
  title,
  children,
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-40 dark:opacity-70"
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg z-10 max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        {/* Title */}
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}

        {/* Content */}
        <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">{children}</div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded transition ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-500'
            }`}
          >
            {loading ? 'Working...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
