import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Using backend endpoints for password reset instead of Amplify client here
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [step, setStep] = useState("login"); // "login" | "forgot" | "verify"
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
const { login } = useAuth();
  // Ensure we have a fallback API URL during development
  const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  // 🟢 Handle Login (connected to backend)
  // 🟢 Handle Login (connected to backend)
const handleLogin = async (e) => {
  e.preventDefault();
  setStatus("");

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email, // ✅ Cognito expects "username", even if it's an email
        password,
      }),
    });
    // parse response safely (handle empty/non-JSON responses)
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      data = { error: text };
    }

    if (res.ok) {
      // ✅ Save token securely in localStorage
      if (data.token) {
  login(data.token); // ✅ updates context + localStorage
}


      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 1200);
    } else {
      setStatus(data.error || "Login failed. Please try again.");
    }
  } catch (err) {
    console.error(err);
    setStatus("Server error. Please try again later.");
  }
};


  // 🟢 Forgot Password (send OTP)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const res = await fetch(`${API_URL}/auth/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("verify");
        setStatus("OTP sent to your email.");
      } else {
        setStatus(data.error || "Error sending OTP");
      }
    } catch (err) {
      setStatus(err.message || "Error sending OTP");
    }
  };

  // 🟢 Confirm Password Reset
  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setStatus("");
    if (newPassword !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/confirm-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, confirmationCode: otp, newPassword }),
      });
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        data = { error: text };
      }
      if (res.ok) {
        setStatus("passwordChanged");
      } else {
        setStatus(data.error || "Error resetting password");
        return;
      }
      setTimeout(() => {
        setStep("login");
        setStatus("");
        setEmail("");
        setPassword("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch (err) {
      setStatus(err.message || "Error resetting password");
    }
  };

  // ✅ Animated Status Message
  const StatusBox = () =>
    status && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`mt-6 text-center text-sm font-medium ${
          status === "success" || status === "passwordChanged"
            ? "text-green-600 bg-green-50 border border-green-200 py-2 rounded-lg"
            : "text-red-600 bg-red-50 border border-red-200 py-2 rounded-lg"
        }`}
      >
        {status === "success"
          ? "Login successful!"
          : status === "passwordChanged"
          ? "Password successfully changed!"
          : status}
      </motion.div>
    );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-black font-sans">
      {/* Left Section */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col justify-center items-center bg-gray-50 border-r border-gray-200 p-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl font-normal mb-4"
        >
          IRONLOG
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-600 text-lg text-center max-w-sm"
        >
          Track. Train. Transform.
          <br />
          {step === "login"
            ? "Log in to your account and continue your fitness journey."
            : "Reset your password to get back on track."}
        </motion.p>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex justify-center items-center p-10"
      >
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <AnimatePresence mode="wait">
            {step === "login" && (
              <motion.div
                key="login-box"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl font-normal text-center mb-8">Login to Your Account</h2>

                <form className="space-y-6" onSubmit={handleLogin}>
                  {/* Email */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-2.5 border border-black hover:bg-black hover:text-white rounded-lg transition-all duration-300"
                  >
                    Login
                  </motion.button>
                </form>

                <AnimatePresence>{StatusBox()}</AnimatePresence>

                <div className="flex justify-between mt-6 text-sm text-gray-600">
                  <button onClick={() => setStep("forgot")} className="hover:underline">
                    Forgot Password?
                  </button>
                  <Link to="/signup" className="hover:underline">
                    Create Account
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Forgot + Verify sections remain unchanged */}
            {step === "forgot" && (
              <motion.div
                key="forgot-box"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl font-normal text-center mb-8">Reset Password</h2>

                <form className="space-y-6" onSubmit={handleForgotPassword}>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-2.5 border border-black hover:bg-black hover:text-white rounded-lg transition-all duration-300"
                  >
                    Send Code
                  </motion.button>
                </form>

                <AnimatePresence>{StatusBox()}</AnimatePresence>

                <div className="flex justify-between mt-6 text-sm text-gray-600">
                  <button onClick={() => setStep("login")} className="hover:underline">
                    Back to Login
                  </button>
                  <button onClick={() => setStep("verify")} className="hover:underline">
                    I have a code
                  </button>
                </div>
              </motion.div>
            )}

            {step === "verify" && (
              <motion.div
                key="verify-box"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl font-normal text-center mb-8">Enter Verification Code</h2>

                <form className="space-y-6" onSubmit={handleConfirmReset}>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Verification Code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter verification code"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-2.5 border border-black hover:bg-black hover:text-white rounded-lg transition-all duration-300"
                  >
                    Change Password
                  </motion.button>
                </form>

                <div className="flex justify-between mt-6 text-sm text-gray-600">
                  <button onClick={() => setStep("forgot")} className="hover:underline">
                    Resend verification code
                  </button>
                  <button onClick={() => setStep("login")} className="hover:underline">
                    Back to Login
                  </button>
                </div>

                <AnimatePresence>{StatusBox()}</AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
