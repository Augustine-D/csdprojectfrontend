// src/components/coordinator/GroupLeadersList.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const GroupLeadersList = () => {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState(null);

  const fetchLeaders = () => {
    API.get("/coordinator/groupleaders/")
      .then((res) => setLeaders(res.data))
      .catch((err) => setError("Could not load group leaders"));
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const toggleLeader = (id, isActive) => {
    API.patch(`/coordinator/groupleaders/${id}/status/`, { is_active: !isActive })
      .then(() => fetchLeaders())
      .catch((err) => setError("Failed to update leader status"));
  };

  if (error) return <div className="text-danger">{error}</div>;
  if (!leaders.length) return <div>Loading group leaders...</div>;

  return (
    <div className="card shadow-sm p-3">
      <h5 className="text-primary">GROUP LEADERS</h5>
      <ul className="list-group list-group-flush" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {leaders.map((leader) => (
          <li key={leader.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {leader.phone} - {leader.role} - {leader.is_active ? "Active" : "Inactive"}
            </span>
            <button
              className={`btn btn-sm ${leader.is_active ? "btn-outline-danger" : "btn-outline-success"}`}
              onClick={() => toggleLeader(leader.id, leader.is_active)}
            >
              {leader.is_active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupLeadersList;
