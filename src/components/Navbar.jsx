import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import context
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, profile } = useAuth(); // ✅ Access shared state
  const [open, setOpen] = useState(false);
  const ddRef = useRef();

  const handleLogout = () => {
    logout();
    fetch(`${import.meta.env.VITE_API_URL || "/api"}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch((err) => console.warn("logout request failed", err));
    window.location.replace("/login");
  };

  useEffect(() => {
    const onDoc = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

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

        {/* Right side actions: show profile icon when authenticated */}
        <div className="flex items-center space-x-4" ref={ddRef}>
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center"
                aria-label="User menu"
              >
                {/* simple initials avatar */}
                <span className="text-sm font-medium">
                  {profile && profile.name ? profile.name.split(" ")[0][0]?.toUpperCase() : "U"}
                </span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/profile-setup"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
