// components/leaderComponents/ProjectProgress.js
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const ProjectProgress = () => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch current user
        const userRes = await API.get("/users/me/");
        setUser(userRes.data);

        // 2️⃣ Fetch latest project progress for the leader
        const progressRes = await API.get("/students/leader/projects/latest-progress/");
        setProgress(progressRes.data);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch data", err);

        if (err.response && err.response.status === 404) {
          setError("No project progress found for your group yet.");
        } else {
          setError("An error occurred while loading data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-3">Loading user and project progress...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-warning text-center my-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="project-progress mb-4">
      {/* Display user info */}
      {user && (
        <div className="mb-3 text-center">
          <h5>
            Logged in as: <strong>{user.full_name || user.phone}</strong> ({user.role})
          </h5>
        </div>
      )}

      {/* Display project progress */}
      {progress ? (
        <>
          <h4 className="mb-3 text-center">
            Project Progress – <strong>{progress.project_title}</strong>
          </h4>

          {/* Overall progress */}
          <div className="d-flex justify-content-between mb-1">
            <span>Overall Progress</span>
            <span>
              {progress.completed_chapters}/{progress.total_chapters} chapters
            </span>
          </div>

          <div className="progress mb-3" style={{ height: "20px" }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${progress.progress_percentage}%` }}
              aria-valuenow={progress.progress_percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress.progress_percentage}%
            </div>
          </div>

          {/* Chapters list */}
          <h5>Chapters:</h5>
          {progress.chapters.length === 0 ? (
            <p className="text-muted">No chapters available for this project.</p>
          ) : (
            <ul className="list-group">
              {progress.chapters.map((chapter) => (
                <li
                  key={chapter.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    chapter.completed ? "list-group-item-success" : ""
                  }`}
                >
                  <div>
                    <strong>{chapter.title}</strong>
                    <br />
                    <small className="text-muted">Max Score: {chapter.max_score}</small>
                  </div>
                  {chapter.completed ? (
                    <span className="badge bg-success">Completed</span>
                  ) : (
                    <span className="badge bg-secondary">Pending</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="alert alert-info text-center my-3" role="alert">
          No project progress data available.
        </div>
      )}
    </div>
  );
};

export default ProjectProgress;
