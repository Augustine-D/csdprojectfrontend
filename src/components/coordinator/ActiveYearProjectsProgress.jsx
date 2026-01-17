// src/components/coordinator/ActiveYearProjectsProgress.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios"; // <-- use your axios instance

const ActiveYearProjectsProgress = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectsProgress = async () => {
      try {
        setLoading(true);
        // Use the API instance with baseURL
        const response = await API.get("coordinator/projects/active/progress/");
        setProjects(response.data);
      } catch (err) {
        console.error("Error fetching project progress:", err);
        setError("Failed to load project progress. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsProgress();
  }, []);

  if (loading) return <p>Loading projects progress...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="active-year-projects-progress">
      <h3 className="mb-3">Active Year Projects Progress</h3>
      {projects.length === 0 ? (
        <p>No active projects found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Project</th>
                <th>Academic Year</th>
                <th>Progress</th>
                <th>Progress %</th>
                <th>Last Submission Date</th>
                <th>Last Submission File</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.project_id}>
                  <td>{proj.project_title}</td>
                  <td>{proj.academic_year}</td>
                  <td>{proj.progress}</td>
                  <td>{proj.progress_percentage}%</td>
                  <td>
                    {proj.last_submission_date
                      ? new Date(proj.last_submission_date).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {proj.last_submission_file ? (
                      <a
                        href={proj.last_submission_file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveYearProjectsProgress;
