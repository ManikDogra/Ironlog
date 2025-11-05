// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; // ✅ added import

export default function Header() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // ✅ use global theme
  const isDark = theme === "dark"; // ✅ consistent across pages

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Add Workout", path: "/workout" },
    { label: "Today", path: "/today-workout" },
    { label: "Weight", path: "/weight-history" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* ✅ Logo (redirects to dashboard) */}
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-black dark:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300">
              <span className="text-white dark:text-black font-bold text-lg">
                IL
              </span>
            </div>
            <span className="hidden sm:inline text-2xl font-bold tracking-wider text-black dark:text-white transition-colors duration-300">
              IRONLOG
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 rounded transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side (Theme Toggle + User Menu + Mobile Toggle) */}
          <div className="flex items-center space-x-4">
            {/* ✅ Global Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`relative w-[52px] h-6 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  isDark ? "translate-x-[29px]" : "translate-x-[2px]"
                }`}
              />
              {/* Sun (left) */}
              <div className="absolute left-[5px] flex items-center justify-center pointer-events-none">
                <Sun
                  size={13}
                  className={`text-gray-600 ${
                    isDark ? "opacity-40" : "opacity-100"
                  } transition-opacity`}
                />
              </div>
              {/* Moon (right) */}
              <div className="absolute right-[4px] flex items-center justify-center pointer-events-none">
                <Moon
                  size={13}
                  className={`text-gray-300 ${
                    isDark ? "opacity-100" : "opacity-40"
                  } transition-opacity`}
                />
              </div>
            </button>

            {/* Desktop User Menu */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {profile?.name || "User"}
                </span>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg transition-colors duration-200"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded transition flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
