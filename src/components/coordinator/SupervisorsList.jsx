// src/components/coordinator/SupervisorsList.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const SupervisorsList = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [error, setError] = useState(null);

  const fetchSupervisors = () => {
    API.get("/coordinator/supervisors/")
      .then((res) => setSupervisors(res.data))
      .catch(() => setError("Could not load supervisors"));
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const toggleSupervisor = (id, isActive) => {
    API.patch(`/coordinator/supervisors/${id}/status/`, { is_active: !isActive })
      .then(() => fetchSupervisors())
      .catch(() => setError("Failed to update supervisor status"));
  };

  if (error) return <div className="text-danger">{error}</div>;
  if (!supervisors.length) return <div>Loading supervisors...</div>;

  return (
    <div className="card shadow-sm p-3">
      <h5 className="text-primary">ACTIVE SUPERVISORS</h5>
      <hr></hr>
      <ul className="list-group list-group-flush" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {supervisors.map((sup) => (
          <li key={sup.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {sup.phone} - {sup.name} - {sup.is_active ? "Active" : "Inactive"}
            </span>
            <button
              className={`btn btn-sm ${sup.is_active ? "btn-outline-danger" : "btn-outline-success"}`}
              onClick={() => toggleSupervisor(sup.id, sup.is_active)}
            >
              {sup.is_active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupervisorsList;
