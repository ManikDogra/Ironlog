import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import App from "./App.jsx";
import "./index.css";
// import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ Import the context

Amplify.configure(awsconfig);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
