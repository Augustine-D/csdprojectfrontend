import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import SupervisorLayout from "../components/SupervisorLayout";
import "./ProjectDetails.css"; // 👈 Make sure this file exists

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/lecturers/supervisor/project/${projectId}/`);
        setProject(res.data.project);
        setChapters(res.data.chapters);
      } catch {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [projectId]);

  const toggleChapterStatus = async (chapterId) => {
    try {
      await API.post(`/lecturers/supervisor/chapter/${chapterId}/toggle/`);
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === chapterId ? { ...ch, is_open: !ch.is_open } : ch
        )
      );
    } catch {
      alert("Failed to update chapter.");
    }
  };

  if (loading)
    return (
      <SupervisorLayout title="WORK IN PROGRESS">
        <p className="text-center py-5">Loading...</p>
      </SupervisorLayout>
    );

  if (error)
    return (
      <SupervisorLayout title="PROJECT IN PROGRESS">
        <div className="alert alert-danger">{error}</div>
      </SupervisorLayout>
    );

  return (
    <SupervisorLayout title="PROJECT IN PROGRESS">
      <div className="container project-details-page">

        {/* Project Information */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <h3 className="fw-bold mb-1">{project.title}</h3>
            <p className="text-muted">Academic Year: {project.academic_year}</p>
          </div>
        </div>

        {/* Chapters */}
        <h5 className="fw-semibold mb-3">Chapters</h5>

        {chapters.length === 0 ? (
          <div className="alert alert-warning">No chapters created yet.</div>
        ) : (
          <div className="list-group">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="list-group-item d-flex justify-content-between align-items-center chapter-item"
              >
                <div>
                  <Link
                    to={`/supervisor/chapter/${chapter.id}`}
                    className="fw-medium text-decoration-none"
                  >
                    {chapter.title}
                  </Link>
                  <span
                    className={`badge ms-3 ${
                      chapter.is_open ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {chapter.is_open ? "Open" : "Closed"}
                  </span>
                </div>

                <button
                  className={`btn btn-sm ${
                    chapter.is_open ? "btn-outline-danger" : "btn-outline-primary"
                  }`}
                  onClick={() => toggleChapterStatus(chapter.id)}
                >
                  {chapter.is_open ? "Close" : "Open"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </SupervisorLayout>
  );
};

export default ProjectDetails;
