// src/pages/CoordinatorDashboard.jsx
import React from "react";
import { CoordinatorProvider } from "../context/CoordinatorContext";
import CoordinatorLayout from "./CoordinatorLayout";

// Components
import ProjectStats from "../components/coordinator/ProjectStats";
import SupervisorsList from "../components/coordinator/SupervisorsList";
import StudentsList from "../components/coordinator/StudentsList";
import ActiveYear from "../components/coordinator/ActiveYear";
import GroupLeadersList from "../components/coordinator/GroupLeadersList";
// import HODsList from "../components/coordinator/HODsList"; // Currently not used
import CoordinatorsList from "../components/coordinator/CoordinatorsList";
import ProjectsList from "../components/coordinator/ProjectsList";
import BulkUploadUsers from "../components/coordinator/BulkUploadUsers";
import ProjectOverview from "../components/coordinator/ProjectOverview";
import SetDeadlines from "../components/coordinator/SetDeadlines";
import SendProjectMessage from "../components/coordinator/SendProjectMessage";
import ActiveYearProjectsProgress from "../components/coordinator/ActiveYearProjectsProgress";
import ProjectProgress from "../components/coordinator/ProjectProgress";

const CoordinatorDashboard = () => {
  return (
    <CoordinatorProvider>
      <CoordinatorLayout title="Dashboard">
        <div className="container-fluid py-1">
          <h2 className="dashboard-title mb-4">COORDINATING PROJECTS SIMPLIFIED</h2>

          {/* --------------------------------------- */}
          {/* Row 1: Admin Tools (Active Year, Bulk Upload, Deadlines, Messages) */}
          {/* --------------------------------------- */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <ActiveYear />
            </div>
            <div className="col-12 col-md-4">
              <BulkUploadUsers />
            </div>
            <div className="col-12 col-md-4">
              <SetDeadlines />
            </div>
          </div>

          {/* --------------------------------------- */}
          {/* Row 2: Project Insights */}
          {/* --------------------------------------- */}
          <div className="row g-4 mb-4">
            <div className="col-12">
              <ActiveYearProjectsProgress />
            </div>
            <div className="col-12">
              <ProjectProgress />
            </div>
            <div className="col-12">
              <ProjectOverview />
            </div>
            <div className="col-12">
              <ProjectStats />
            </div>
          </div>

          {/* --------------------------------------- */}
          {/* Row 3: Supervisors */}
          {/* --------------------------------------- */}
          <div className="row g-4 mb-4">
            {/* <div className="col-6">
              <HODsList />
            </div> */}
            <div className="col-12">
              <SupervisorsList />
            </div>
          </div>

          {/* --------------------------------------- */}
          {/* Row 4: Students + Group Leaders */}
          {/* --------------------------------------- */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-lg-6">
              <StudentsList />
            </div>
            <div className="col-12 col-lg-6">
              <GroupLeadersList />
            </div>
          </div>

   {/* --------------------------------------- */}
{/* Row 5: Coordinators + Projects */}
{/* --------------------------------------- */}
<div className="mb-4">
  <CoordinatorsList />
</div>
<div className="mb-4">
  <ProjectsList />
</div>

        </div>
      </CoordinatorLayout>
    </CoordinatorProvider>
  );
};

export default CoordinatorDashboard;
