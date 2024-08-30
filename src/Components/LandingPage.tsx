import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/landing.css";

function LandingPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Error handling for empty fields
    if (!username && !password) {
      setError("Both username and password are required.");
      return;
    } else if (!username) {
      setError("Username is required.");
      return;
    } else if (!password) {
      setError("Password is required.");
      return;
    } else {
      setError("");
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (response.ok) {
        // Navigate to the main app if login is successful
        navigate("/app");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!username && !password) {
      setError("Both username and password are required.");
      return;
    } else if (!username) {
      setError("Username is required.");
      return;
    } else if (!password) {
      setError("Password is required.");
      return;
    } else {
      setError("");
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (response.ok) {
        // Navigate to the main app if registration is successful
        navigate("/app");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="landing-container">
      <h1 className="landing-header">Welcome to FretMap</h1>
      <div className="landing-content">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        <div className="button-container">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
