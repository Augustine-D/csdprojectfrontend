import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ roles = [], children }) => {
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("role");

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if user role is not allowed
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component
  return children;
};

export default PrivateRoute;
