import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import WorkoutLog from "./pages/WorkoutLog";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ConfirmSignup from "./pages/ConfirmSignup";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <div>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/workout" element={<WorkoutLog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm-signup" element={<ConfirmSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />


        </Routes>
      </div>
    </div>
  );
}

export default App;
