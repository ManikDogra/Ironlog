import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Simplified guard: check auth context and localStorage token synchronously.
// This avoids timing/race issues where effects may be delayed and allow
// access to protected routes before state updates finish.
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, profileCompleted, loading } = useAuth();

  // Read token synchronously from localStorage on every render
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but hasn't completed profile setup, redirect to setup
  if (isAuthenticated && !profileCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

export default PrivateRoute;
