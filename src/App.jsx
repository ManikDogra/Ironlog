import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import WorkoutLog from "./pages/WorkoutLog";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext"; // ✅ added import

function App() {
  return (
    <AuthProvider>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/about" element={<About />} />
          <Route path="/workout" element={<WorkoutLog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Protected Route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
