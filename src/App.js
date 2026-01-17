import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Importing pages
import Login from "./pages/Login";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import ProjectDetails from "./pages/ProjectDetails";
import ChapterDetails from "./pages/ChapterDetails";
import LeaderDashboard from "./pages/LeaderDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import HodDashboard from "./pages/HodDashboard";
import ChapterSubmissionComponent from "./components/leaderComponents/ChapterSubmissionComponent";

// Importing PrivateRoute (for protected routes)
import PrivateRoute from "./components/PrivateRoute";

function App() {
  // Get user role from local storage
  const userRole = JSON.parse(localStorage.getItem("user"))?.role;

  return (
    <Router>
      <Routes>
        {/* Default route to redirect based on user role */}
        <Route
          path="/"
          element={
            <Navigate 
              to={
                userRole === "STUDENT" || userRole === "LEADER"
                  ? "/leader"
                  : `/${userRole?.toLowerCase() || 'login'}`
              } 
              replace 
            />
          }
        />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Supervisor Routes */}
        <Route
          path="/supervisor"
          element={
            <PrivateRoute roles={["SUPERVISOR"]}>
              <SupervisorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/supervisor/project/:projectId"
          element={
            <PrivateRoute roles={["SUPERVISOR"]}>
              <ProjectDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/supervisor/chapter/:chapterId"
          element={
            <PrivateRoute roles={["SUPERVISOR"]}>
              <ChapterDetails />
            </PrivateRoute>
          }
        />

        {/* Leader Routes (accessible by both LEADER and STUDENT) */}
        <Route
          path="/leader"
          element={
            <PrivateRoute roles={["LEADER", "STUDENT"]}>
              <LeaderDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/leader/project/:projectId"
          element={
            <PrivateRoute roles={["LEADER", "STUDENT"]}>
              <ProjectDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/leader/chapter/:chapterId"
          element={
            <PrivateRoute roles={["LEADER", "STUDENT"]}>
              <ChapterDetails />
            </PrivateRoute>
          }
        />

        {/* Chapter submission route (accessible by both LEADER and STUDENT) */}
        <Route
          path="/students/leader/projects/:projectId/chapters/:chapterId/submission"
          element={
            <PrivateRoute roles={["LEADER", "STUDENT"]}>
              <ChapterSubmissionComponent />
            </PrivateRoute>
          }
        />

        {/* Coordinator Routes */}
        <Route
          path="/coordinator"
          element={
            <PrivateRoute roles={["COORDINATOR"]}>
              <CoordinatorDashboard />
            </PrivateRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <PrivateRoute roles={["STUDENT"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        {/* HOD Routes */}
        <Route
          path="/hod"
          element={
            <PrivateRoute roles={["HOD"]}>
              <HodDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
