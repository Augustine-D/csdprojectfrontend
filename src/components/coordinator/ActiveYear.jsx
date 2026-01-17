// src/components/coordinator/AcademicYears.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AcademicYears = () => {
  const [years, setYears] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchYears = async () => {
    setLoading(true);
    try {
      const res = await API.get("/coordinator/academic-year/");
      setYears(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not load academic years");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  const toggleYear = async (yearId, isActive) => {
    try {
      await API.patch(`/coordinator/academic-year/${yearId}/status/`, { is_active: !isActive });
      fetchYears();
    } catch (err) {
      console.error(err);
      setError("Failed to update year status");
    }
  };

  const addYear = async () => {
    if (!newYear) return;
    try {
      await API.post("/coordinator/academic-year/", { year: newYear });
      setNewYear("");
      fetchYears();
    } catch (err) {
      console.error(err);
      setError("Failed to add new academic year");
    }
  };

  const deleteYear = async (yearId) => {
    if (!window.confirm("Are you sure you want to delete this year?")) return;
    try {
      await API.delete(`/coordinator/academic-year/${yearId}/`);
      fetchYears();
    } catch (err) {
      console.error(err);
      setError("Failed to delete academic year");
    }
  };

  if (loading) return <div>Loading academic years...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="card shadow-sm p-3">
      <h5 className="text-primary mb-3">ACADEMIC YEARS</h5>

      <div className="mb-3 d-flex gap-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Enter new year (e.g., 2025/2026)"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
        />
        <button className="btn btn-sm btn-primary" onClick={addYear}>
          Add Year
        </button>
      </div>

      <ul className="list-group list-group-flush">
        {years.map((year) => (
          <li
            key={year.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {year.year} - {year.is_active ? "Active" : "Inactive"}
            </span>
            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm ${
                  year.is_active ? "btn-outline-danger" : "btn-outline-success"
                }`}
                onClick={() => toggleYear(year.id, year.is_active)}
              >
                {year.is_active ? "Deactivate" : "Activate"}
              </button>
              {/*
<button
  className="btn btn-sm btn-outline-danger"
  onClick={() => deleteYear(year.id)}
>
  Delete
</button>
*/}

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcademicYears;
