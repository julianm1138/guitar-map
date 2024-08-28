import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FretboardApp from "./Components/FretboardApp";
import LandingPage from "./Components/LandingPage";
import "./assets/styles/Fretboard.css";
import "./assets/styles/interface.css";
import "./index.css";

function handleRouting() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<FretboardApp />} />
      </Routes>
    </Router>
  );
}

export default handleRouting;
