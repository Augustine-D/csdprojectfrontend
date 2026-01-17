// src/components/coordinator/StudentsList.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  const fetchStudents = () => {
    API.get("/coordinator/students/")
      .then((res) => setStudents(res.data))
      .catch(() => setError("Could not load students"));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const toggleStudent = (id, isActive) => {
    API.patch(`/coordinator/students/${id}/status/`, { is_active: !isActive })
      .then(() => fetchStudents())
      .catch(() => setError("Failed to update student status"));
  };

  if (error) return <div className="text-danger">{error}</div>;
  if (!students.length) return <div>Loading students...</div>;

  return (
    <div className="card shadow-sm p-3">
      <h5 className="text-primary">ACTIVE STUDENTS</h5>
      <ul className="list-group list-group-flush" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {students.map((s) => (
          <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {s.phone} - {s.name} - {s.is_active ? "Active" : "Inactive"}
            </span>
            <button
              className={`btn btn-sm ${s.is_active ? "btn-outline-danger" : "btn-outline-success"}`}
              onClick={() => toggleStudent(s.id, s.is_active)}
            >
              {s.is_active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsList;
