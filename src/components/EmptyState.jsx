// src/components/EmptyState.jsx
import React from "react";
import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-gray-700 dark:text-gray-300 transition-colors duration-300"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-6"
      >
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center transition-colors duration-300">
          {Icon && <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />}
        </div>
      </motion.div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6 transition-colors duration-300">
        {description}
      </p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 font-medium"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
