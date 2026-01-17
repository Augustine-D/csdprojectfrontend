import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./SupervisorLayout.css";

const SupervisorLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className="layout-container">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="text-center py-3 border-bottom">
          <h4 className="fw-bold m-0">SUPERVISOR</h4>
        </div>

        <nav className="nav flex-column mt-3">
          <Link
            to="/supervisor"
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

export default SupervisorLayout;
