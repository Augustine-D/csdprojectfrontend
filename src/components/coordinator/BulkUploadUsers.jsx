import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const BulkUploadUsers = () => {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [years, setYears] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch academic years on mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await API.get("/coordinator/academic-year/");
        setYears(res.data);
      } catch (err) {
        console.error("Failed to fetch academic years:", err);
        setMessage("❌ Failed to fetch academic years. Please try again.");
      }
    };
    fetchYears();
  }, []);

  const handleUpload = async () => {
    // Validate input fields before submitting
    if (!file) {
      setMessage("❌ Please select a file.");
      return;
    }

    if (!role) {
      setMessage("❌ Please select a role.");
      return;
    }

    if (!academicYearId) {
      setMessage("❌ Please select an academic year.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);
    formData.append("academic_year_id", academicYearId);

    try {
      const res = await API.post("/coordinator/users/bulk-upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle server response: mapping created users and errors
      const createdUsers = (res.data.created || []).map(
        (user) => user.phone || user.index_number || JSON.stringify(user)
      );
      const errors = (res.data.errors || []).map(
        (err) => err.phone || err.index_number || JSON.stringify(err)
      );

      if (res.status === 200) {
        setMessage(
          `✅ Created users: ${createdUsers.join(", ") || "None"}\n❌ Errors: ${
            errors.join(", ") || "None"
          }`
        );
      } else {
        // Catch any error returned from the server
        setMessage(
          `❌ Error during upload. ${res.data.detail || "Please check the file format and try again."}`
        );
      }
    } catch (err) {
      console.error("Upload failed:", err);

      if (err.response) {
        // Handle HTTP errors from the backend
        if (err.response.status === 400) {
          // Bad Request (typically validation errors)
          const errorDetail = err.response.data.detail || "Invalid data. Please check your input.";
          setMessage(`❌ ${errorDetail}`);
        } else if (err.response.status === 404) {
          // Not Found
          setMessage("❌ The requested resource was not found.");
        } else if (err.response.status === 500) {
          // Internal Server Error
          setMessage("❌ Server error. Please try again later.");
        } else {
          setMessage(`❌ Something went wrong. Status: ${err.response.status}`);
        }
      } else if (err.request) {
        // No response from the backend
        setMessage("❌ No response from the server. Please check your connection.");
      } else {
        // Other errors
        setMessage("❌ An error occurred during the request.");
      }
    }
  };

  return (
    <div className="card p-3">
      <h5 className="text-primary mb-3">UPLOAD SYSTEM DATA</h5>

      <div className="mb-3">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div className="mb-3">
        <select
          className="form-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select role</option>
          <option value="STUDENT">Student</option>
          <option value="LEADER">Group Leader</option>
          <option value="SUPERVISOR">Supervisor</option>
          <option value="HOD">HOD</option>
          <option value="COORDINATOR">Coordinator</option>
        </select>
      </div>

      <div className="mb-3">
        <select
          className="form-select"
          value={academicYearId}
          onChange={(e) => setAcademicYearId(e.target.value)}
        >
          <option value="">Select academic year</option>
          {years.map((year) => (
            <option key={year.id} value={year.id}>
              {year.year}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" onClick={handleUpload}>
        Upload
      </button>

      {message && (
        <div className="mt-3 text-info" style={{ whiteSpace: "pre-line" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default BulkUploadUsers;
