import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import context

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // ✅ Access shared state

  const handleLogout = () => {
    console.log("Navbar: handleLogout clicked");
    // Clear client side storage synchronously first so the token is removed immediately
    logout();
    // Then tell backend to clear any httpOnly cookies (if present). Do not block UI — just try.
    fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch((err) => console.warn("logout request failed", err));
    // Force a full reload to ensure all in-memory state is cleared
    window.location.replace("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Left side links */}
        <div className="flex space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/workout" className="hover:underline">
            Workout Log
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
