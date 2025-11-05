import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import WorkoutLog from "./pages/WorkoutLog";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePage from "./pages/ProfilePage";
import TodayWorkout from "./pages/TodayWorkout";
import History from "./pages/History";
import WeightHistory from "./pages/WeightHistory";
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
          <Route
            path="/profile-setup"
            element={
              <ProfileSetup />
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/today-workout" element={<PrivateRoute><TodayWorkout/></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History/></PrivateRoute>} />
          <Route path="/weight-history" element={<PrivateRoute><WeightHistory/></PrivateRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
