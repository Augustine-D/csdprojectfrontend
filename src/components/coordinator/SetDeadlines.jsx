import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const SetDeadline = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch only active academic years
  const fetchAcademicYears = async () => {
    try {
      const res = await API.get("/coordinator/academic-year/");
      const activeYears = res.data.filter((year) => year.is_active === true);
      setAcademicYears(activeYears);
    } catch (err) {
      console.error("Error fetching academic years:", err);
      setError("Failed to load academic years.");
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedYear || !deadline) {
      setError("Please select an academic year and a deadline date.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // If date only, add default time 23:59:00
      let finalDeadline = deadline;
      if (deadline.length === 10) {
        finalDeadline = `${deadline}T23:59:00`;
      }

      const res = await API.post("/coordinator/coordinator/set-deadline/", {
        academic_year: selectedYear, // now matches year string, backend fixes it
        deadline: finalDeadline,
      });

      setMessage(res.data.detail || "Deadline set successfully!");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "An error occurred while setting the deadline."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-3 mb-3">
      <h5 className="text-primary mb-3">SET PROJECT DEADLINES</h5>

      {message && <div className="alert alert-success py-2">{message}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small text-muted mb-1">
            Active Academic Year
          </label>
          <select
            className="form-select form-select-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">-- Select Active Year --</option>
            {academicYears.map((year) => (
              <option key={year.id} value={year.year}>
                {year.year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label small text-muted mb-1">
            Select Deadline Date
          </label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <small className="text-muted">
            Time automatically defaults to <b>23:59</b>
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-primary"
          disabled={loading}
        >
          {loading ? "Setting Deadline..." : "Set Deadline"}
        </button>
      </form>
    </div>
  );
};

export default SetDeadline;
