import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import API from "../../api/axios";

const SupervisorProjects = () => {
  const [projects, setProjects] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [groupsCount, setGroupsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async (yearId = "") => {
    setLoading(true);
    try {
      const res = await API.get("/lecturers/supervisor/projects/", {
        params: yearId ? { academic_year: yearId } : {},
      });
      setProjects(res.data.projects || []);
      setGroupsCount(res.data.groups_count || 0);
      setStudentsCount(res.data.students_count || 0);
      setAcademicYears(res.data.academic_years || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const startProjectChapters = async (projectId) => {
    try {
      const response = await API.post(`/lecturers/supervisor/start_project_chapters/${projectId}/`);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                progress: response.data.progress,
                total_chapters: response.data.total_chapters,
              }
            : project
        )
      );
    } catch (err) {
      console.error("Failed to start project chapters:", err);
      alert("Failed to start project chapters.");
    }
  };

  useEffect(() => {
    fetchProjects(selectedYear);
  }, [selectedYear]);

  return (
    <div className="container mt-4">
      <h3>Supervisor Projects</h3>

      <div className="mb-3">
        <label className="form-label">Select Academic Year</label>
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

      <div className="mb-3">
        <p>Total Groups Assigned: {groupsCount}</p>
        <p>Total Students: {studentsCount}</p>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Project Title (ID)</th>
              <th>Group</th>
              <th>Students in Group</th>
              <th>Academic Year</th>
              <th>Proposal Version</th>
              <th>Proposal File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                {/* Display Project ID along with the title */}
                <td>
                  {project.title} (ID: {project.id})
                </td>
                <td>{project.group_name}</td>
                <td>{project.student_count}</td>
                <td>{project.academic_year}</td>
                <td>{project.current_proposal_version}</td>
                <td>
                  {project.proposal_file_url ? (
                    <a href={project.proposal_file_url} download>
                      Download Proposal
                    </a>
                  ) : (
                    "No Proposal"
                  )}
                </td>
                <td>
                  {/* Start button (if not started) */}
                  {!project.progress && (
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => startProjectChapters(project.id)}
                    >
                      Start
                    </button>
                  )}

                  {/* View Details link */}
                  <Link
                    to={`/supervisor/project/${project.id}`}
                    className="btn btn-info btn-sm"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SupervisorProjects;
