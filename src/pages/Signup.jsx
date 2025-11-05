import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setPasswordsMatch(password && confirmPassword && password === confirmPassword);
  }, [password, confirmPassword]);

  const validatePassword = (pwd) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return pwd.length >= minLength && hasUpper && hasLower && hasNumber && hasSymbol;
  };

  const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  const handleSignup = async (e) => {
    e.preventDefault();
    // clear previous
    setStatusMessage("");
    setStatusType("");
    setPasswordError("");

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one symbol.");
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage("Passwords do not match!");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatusType("loading");
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password,
          email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Show inline success and switch to confirm step
        setStatusMessage("Signup successful! Check your email for the verification code.");
        setStatusType("success");
        setStep("confirm");
      } else {
        setStatusMessage(data.error || "Error signing up");
        setStatusType("error");
      }
    } catch (err) {
      setStatusMessage("Server error. Please try again later.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setStatusType("");

    if (!otp.trim()) {
      setStatusMessage("Please enter the verification code.");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatusType("loading");
    try {
      const res = await fetch(`${API_URL}/auth/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          code: otp,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage("Account confirmed! You can now log in.");
        setStatusType("success");
        // Optionally redirect to login after a delay
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatusMessage(data.error || "Error confirming account");
        setStatusType("error");
      }
    } catch (err) {
      setStatusMessage("Server error. Please try again later.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setStatusMessage("");
    setStatusType("loading");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage("Verification code resent! Please check your email.");
        setStatusType("success");
      } else {
        setStatusMessage(data.error || "Error resending code");
        setStatusType("error");
      }
    } catch (err) {
      setStatusMessage("Server error. Please try again later.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-black dark:bg-gray-950 dark:text-gray-100 font-sans">      {/* Left Section */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-10"
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
          Join the Ironlog community and take control of your fitness journey.
        </motion.p>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex justify-center items-center p-10"
      >
        <motion.div
          className={`w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8 transition-all duration-300 ${
            loading || statusType === "loading" ? "opacity-70" : "opacity-100"
          }`}
        >
          {step === "signup" ? (
            <>
              <h2 className="text-3xl font-normal text-center mb-8">
                Create Your Account
              </h2>

              <form className="space-y-6" onSubmit={handleSignup}>
                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-gray-400 dark:text-gray-100"

                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
                  />
                  {passwordError && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
                  />
                  {confirmPassword && (
                    <p className={`text-xs mt-1 ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                      {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                  {passwordError && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 border border-black hover:bg-black hover:text-white rounded-lg transition-all duration-300"
                >
                  {loading && statusType === "loading" ? "Creating Account..." : "Sign Up"}
                </motion.button>
              </form>

              {/* Inline status message (keeps design) */}
              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={`mt-6 text-center text-sm font-medium py-2 rounded-lg ${
                      statusType === "success"
                        ? "text-green-600 bg-green-50 border border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800"
                        : statusType === "error"
                        ? "text-red-600 bg-red-50 border border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800"
                        : "text-gray-700 bg-gray-50 border border-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700"

                    }`}
                  >
                    {statusMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-sm text-center mt-6 text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-black hover:underline font-medium"
                >
                  Sign in
                </a>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">

                Confirm Your Account
              </h2>

              <form onSubmit={handleConfirm} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the code sent to your email"
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition"
                >
                  {loading && statusType === "loading" ? "Verifying..." : "Confirm Account"}
                </button>
              </form>

              {/* Inline status message for confirm step */}
              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={`mt-6 text-center text-sm font-medium py-2 rounded-lg ${
                      statusType === "success"
                        ? "text-green-600 bg-green-50 border border-green-200"
                        : statusType === "error"
                        ? "text-red-600 bg-red-50 border border-red-200"
                        : "text-gray-700 bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {statusMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleResend}
                className="w-full mt-4 text-sm text-gray-600 hover:underline"
              >
                Resend Code
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
