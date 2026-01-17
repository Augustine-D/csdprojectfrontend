// src/layouts/CoordinatorLayout.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./coordinator.css";  // Make sure the updated CSS is applied

const CoordinatorLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="text-center py-3 border-bottom">
          <h4 className="fw-bold m-0">COORDINATOR</h4>
        </div>

        <nav className="nav flex-column mt-3">
          <Link
            to="/coordinator"
            className={`nav-link ${location.pathname.includes("dashboard") && "active"}`}
          >
            Dashboard
          </Link>
         
        </nav>

        <div className="mt-auto p-3">
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
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

export default CoordinatorLayout;
