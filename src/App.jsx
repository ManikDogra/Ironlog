import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import WorkoutLog from "./pages/WorkoutLog";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import signup from "./pages/signup";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/"; // hide Navbar on Welcome page

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/workout" element={<WorkoutLog />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
