import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Simplified guard: check auth context and localStorage token synchronously.
// This avoids timing/race issues where effects may be delayed and allow
// access to protected routes before state updates finish.
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Read token synchronously from localStorage on every render
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
