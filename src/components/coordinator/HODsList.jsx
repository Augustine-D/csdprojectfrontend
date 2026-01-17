// src/components/coordinator/HODsList.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const HODsList = () => {
  const [hods, setHODs] = useState([]);
  const [error, setError] = useState(null);

  const fetchHODs = () => {
    API.get("/coordinator/hods/")
      .then((res) => setHODs(res.data))
      .catch(() => setError("Could not load HODs"));
  };

  useEffect(() => {
    fetchHODs();
  }, []);

  const toggleHOD = (id, isActive) => {
    API.patch(`/coordinator/hods/${id}/status/`, { is_active: !isActive })
      .then(() => fetchHODs())
      .catch(() => setError("Failed to update HOD status"));
  };

  if (error) return <div className="text-danger">{error}</div>;
  if (!hods.length) return <div>Loading HODs...</div>;

  return (
    <div className="card shadow-sm p-3">
      <h5 className="text-primary">HODs</h5>
      <ul className="list-group list-group-flush">
        {hods.map((hod) => (
          <li key={hod.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{hod.phone} - {hod.name} - {hod.is_active ? "Active" : "Inactive"}</span>
            <button
              className={`btn btn-sm ${hod.is_active ? "btn-outline-danger" : "btn-outline-success"}`}
              onClick={() => toggleHOD(hod.id, hod.is_active)}
            >
              {hod.is_active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HODsList;
