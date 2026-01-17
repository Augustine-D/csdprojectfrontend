import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import SupervisorLayout from "../components/SupervisorLayout";

const SupervisorProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await API.get("/lecturers/supervisor/projects/", {
          params: selectedYear ? { academic_year: selectedYear } : {},
        });
        setProjects(res.data.projects || []);
        setAcademicYears(res.data.academic_years || []);
      } catch {
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedYear]);

  const startProjectChapters = async (projectId) => {
    try {
      const res = await API.post(
        `/lecturers/supervisor/start_project_chapters/${projectId}/`
      );

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? { ...project, chapters: res.data.chapters } : project
        )
      );

      const projectTitle = projects.find((p) => p.id === projectId)?.title;
      setToastMessage(`Chapters for "${projectTitle}" have been created.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      alert("Failed to start project chapters.");
    }
  };

  return (
    <SupervisorLayout title="ASSIGNED PROJECTS">

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter */}
      <div className="mb-4" style={{ maxWidth: "300px" }}>
        <label className="form-label fw-semibold">Filter by Academic Year</label>
        <select
          className="form-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All Years</option>
          {academicYears.map((year) => (
            <option key={year.id} value={year.id}>
              {year.year}
            </option>
          ))}
        </select>
      </div>

      {/* Projects */}
      {loading ? (
        <div className="alert alert-info">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="alert alert-warning">No projects available.</div>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div className="col-lg-4 col-md-6 mb-4" key={project.id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold mb-2">
                    <Link to={`/supervisor/project/${project.id}`} className="text-decoration-none text-dark">
                      {project.title}
                    </Link>
                  </h5>
                  <p className="text-muted mb-1">Group: {project.group_name}</p>
                  <p className="text-muted mb-1">Students: {project.student_count}</p>
                  <p className="text-muted mb-3">Academic Year: {project.academic_year}</p>

                  {project.proposal_file_url ? (
                    <a href={project.proposal_file_url} download className="btn btn-outline-primary btn-sm mb-3">
                      Download Proposal
                    </a>
                  ) : (
                    <span className="text-danger mb-3">No Proposal Available</span>
                  )}

                  <div className="mt-auto">
                    {!project.chapters || project.chapters.length === 0 ? (
                      <button className="btn btn-primary w-100" onClick={() => startProjectChapters(project.id)}>
                        Start Chapters
                      </button>
                    ) : (
                      <span className="badge bg-success w-100 py-2">Chapters Started</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showToast && (
        <div className="toast show position-fixed bottom-0 end-0 m-3">
          <div className="toast-header">
            <strong className="me-auto">Success</strong>
            <button className="btn-close" onClick={() => setShowToast(false)}></button>
          </div>
          <div className="toast-body">{toastMessage}</div>
        </div>
      )}
    </SupervisorLayout>
  );
};

export default SupervisorProjectsList;
