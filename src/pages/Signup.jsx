import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signUp, confirmSignUp, resendSignUpCode } from "@aws-amplify/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // statusMessage: text to show; statusType: "", "error", "success", "loading"
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    // clear previous
    setStatusMessage("");
    setStatusType("");

    if (password !== confirmPassword) {
      setStatusMessage("Passwords do not match!");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatusType("loading");
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });

      // Show inline success and switch to confirm step
      setStatusMessage("Signup successful! Check your email for the verification code.");
      setStatusType("success");
      setStep("confirm");
    } catch (err) {
      setStatusMessage(err?.message || "Error signing up");
      setStatusType("error");
    } finally {
      setLoading(false);
      // keep status visible (caller can retry); don't clear automatically
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setStatusType("loading");
    setLoading(true);

    try {
      await confirmSignUp({ username: email, confirmationCode: otp });

      // Success: show inline success message, slightly transparent box already via loading
      setStatusMessage("✅ Verification successful! Continue to login...");
      setStatusType("success");

      // wait 2s then redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setStatusMessage(err?.message || "Error confirming account");
      setStatusType("error");
      // revert loading state so user can retry
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setStatusMessage("");
    setStatusType("loading");
    try {
      await resendSignUpCode({ username: email });
      setStatusMessage("Verification code resent! Please check your email.");
      setStatusType("success");
    } catch (err) {
      setStatusMessage(err?.message || "Error resending code");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

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
          className={`w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 transition-all duration-300 ${
            // slightly transparent while loading/processing
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
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
              <h2 className="text-2xl font-bold text-center text-gray-800">
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
