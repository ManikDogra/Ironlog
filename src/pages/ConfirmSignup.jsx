import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmSignUp } from "@aws-amplify/auth";

export default function ConfirmSignup() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      await confirmSignUp({ username, confirmationCode: code });
      alert("Account confirmed! You can now log in.");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Error confirming account");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Confirm Your Account
        </h2>
        <form onSubmit={handleConfirm} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code sent to your email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition"
          >
            Confirm Account
          </button>
        </form>
      </div>
    </div>
  );
}
