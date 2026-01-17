// src/components/coordinator/CoordinatorsList.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const CoordinatorsList = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [error, setError] = useState(null);

  const fetchCoordinators = () => {
    API.get("/coordinator/coordinators/")
      .then((res) => setCoordinators(res.data))
      .catch(() => setError("Could not load coordinators"));
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const toggleCoordinator = (id, isActive) => {
    API.patch(`/coordinator/coordinators/${id}/status/`, { is_active: !isActive })
      .then(() => fetchCoordinators())
      .catch(() => setError("Failed to update coordinator status"));
  };

  if (error) return <div className="text-danger">{error}</div>;
  if (!coordinators.length) return <div>Loading coordinators...</div>;

  return (
    <div className="card shadow-sm p-3">
      <h5 className="text-primary">ACTIVE COORDINATORS</h5>
      <ul className="list-group list-group-flush">
        {coordinators.map((c) => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{c.phone} - {c.name} - {c.is_active ? "Active" : "Inactive"}</span>
            <button
              className={`btn btn-sm ${c.is_active ? "btn-outline-danger" : "btn-outline-success"}`}
              onClick={() => toggleCoordinator(c.id, c.is_active)}
            >
              {c.is_active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoordinatorsList;
