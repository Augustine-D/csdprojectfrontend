// src/pages/Login.js
import React, { useState } from "react";
import API from "../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/login/", { phone, password });

      // Save tokens and role to local storage
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("phone", phone);

      // Redirect based on role
      switch (res.data.role) {
        case "STUDENT":
        case "LEADER":
          // Both students and leaders go to the same dashboard
          window.location.href = "/leader";
          break;
        case "SUPERVISOR":
          window.location.href = "/supervisor";
          break;
        case "HOD":
          window.location.href = "/hod";
          break;
        case "COORDINATOR":
          window.location.href = "/coordinator";
          break;
        default:
          window.location.href = "/login";
      }
    } catch (err) {
      console.error(err);
      setError("Invalid phone or password");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="text-center mb-3">
          <img
            src="/logo.jpg"
            alt="TTU Logo"
            style={{ width: "80px", marginBottom: "10px" }}
          />
          <h4 className="fw-bold text-primary"> CS PROJECT WORK HUB</h4>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ backgroundColor: "#004aad" }}
          >
            Login
          </button>

          <div className="text-center mt-3">
            <a href="#" className="text-decoration-none small text-primary">
              Forgot Token?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
