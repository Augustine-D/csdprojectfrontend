// src/pages/LeaderDashboard.jsx
import React, { useEffect, useState } from "react";
import LeaderLayout from "./LeaderLayout"; // Custom layout for leader pages
import API from "../api/axios";
import GroupInfo from "../components/leaderComponents/GroupInfo";
import Notifications from "../components/leaderComponents/Notifications";
import LeaderProjectManager from "../components/leaderComponents/LeaderProjectManager";
import ProjectProgress from "../components/leaderComponents/ProjectProgress";
import JoinGroup from "../components/leaderComponents/JoinGroup";

const LeaderDashboard = () => {
  const [group, setGroup] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await API.get("/students/leader/dashboard/");
      setGroup(res.data.group);
      setNotifications(res.data.notifications);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const isStudentInGroup = group !== null;

  return (
    <LeaderLayout title="Group Dashboard">
      {loading && <p>Loading dashboard...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <div className="container-fluid py-4">
          <h2 className="dashboard-title mb-4">WORK WITH YOUR GROUP</h2>

          {/* Row 1 - Join Group (shown only if not in a group) */}
          {!isStudentInGroup && (
            <div className="row g-4 mt-4">
              <div className="col-md-12">
                <JoinGroup />
              </div>
            </div>
          )}

          {/* Row 2 - Group Info and Notifications */}
          {isStudentInGroup && (
            <div className="row g-4 mt-4">
              <div className="col-md-6">
                <GroupInfo group={group} />
              </div>
              <div className="col-md-6">
                <Notifications notifications={notifications} />
              </div>
            </div>
          )}

          {/* Row 3 - Project Management */}
          {isStudentInGroup && (
            <div className="row g-4 mt-4">
              <div className="col-md-12">
                <LeaderProjectManager group={group} />
              </div>
            </div>
          )}

          {/* Row 4 - Project Progress */}
          {isStudentInGroup && (
            <div className="row g-4 mt-4">
              <div className="col-md-12">
                <ProjectProgress group={group} />
              </div>
            </div>
          )}
        </div>
      )}
    </LeaderLayout>
  );
};

export default LeaderDashboard;
