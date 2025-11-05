import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function PageHeader({ title }) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <Link
        to="/dashboard"
        className="p-2 bg-gray-200 hover:bg-gray-300 text-black rounded transition
                   dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
      >
        <Home className="w-5 h-5" /> {/* ✅ Correct icon component */}
      </Link>

      {title && <h2 className="text-2xl font-bold">{title}</h2>}
    </div>
  );
}
