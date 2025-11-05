import React, { useEffect } from 'react';

export default function UndoToast({ open, message, onUndo, onClose, duration = 6000 }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-4 py-3 flex items-center space-x-4">
        <div className="text-sm text-gray-800">{message}</div>
        <div className="ml-2">
          <button onClick={onUndo} className="px-3 py-1 bg-gray-100 rounded text-sm">Undo</button>
        </div>
      </div>
    </div>
  );
}
