import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./FretboardApp";
import LandingPage from "./Components/LandingPage";
import "./assets/styles/Fretboard.css";
import "./assets/styles/interface.css";
import "./index.css";

function handleRouting() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  );
}

export default handleRouting;
