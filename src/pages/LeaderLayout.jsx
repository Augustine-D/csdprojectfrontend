// src/layouts/LeaderLayout.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./LeaderLayout.css"; // Add any custom styles for LeaderLayout

const LeaderLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className="leader-layout d-flex">
      {/* Sidebar */}
      <aside className="sidebar shadow-sm">
        <div className="text-center py-3 border-bottom">
          <h4 className="fw-bold m-0">GROUP</h4>
        </div>
        <nav className="nav flex-column mt-3">
          <Link
            to="/leader"
            className={`nav-link ${location.pathname === "/leader" && "active"}`}
          >
            Dashboard
          </Link>
          
          {/* Add other links if needed */}
        </nav>
        <div className="mt-auto p-3">
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content-area flex-grow-1">
        <header className="header-bar">
          <h5 className="m-0 fw-semibold">{title}</h5>
        </header>
        <section className="page-content-area">
          {children}
        </section>
      </main>
    </div>
  );
};

export default LeaderLayout;
