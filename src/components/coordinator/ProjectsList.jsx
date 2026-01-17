import React, { useContext } from "react";
import { CoordinatorContext } from "../../context/CoordinatorContext";

const ProjectsList = () => {
  const { projects, supervisors, loading, error, updateProject } = useContext(CoordinatorContext);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!projects.length) return <div>No projects found.</div>;

  const toggleApproval = (project) => {
    updateProject(project.id, { approved: !project.approved });
  };

  const handleSupervisorToggle = (projectId, supervisorId) => {
    const project = projects.find((p) => p.id === projectId);
    const updated = project.localSupervisors.includes(supervisorId)
      ? project.localSupervisors.filter((id) => id !== supervisorId)
      : [...project.localSupervisors, supervisorId];
    updateProject(projectId, { supervisors: updated });
  };

  const handleMaxChaptersChange = (projectId, value) => {
    const num = parseInt(value);
    if (!isNaN(num)) updateProject(projectId, { max_chapters: num });
  };

  const handleDeadlineChange = (projectId, value) => {
    updateProject(projectId, { submission_deadline: value });
  };

  return (
    <div className="card p-3 shadow-sm">
      <h5 className="text-primary mb-3">PROJECTS FOR THE ACTIVE ACADEMIC YEAR(S)</h5>
      <ul className="list-group list-group-flush">
        {projects.map((p) => (
          <li key={p.id} className="list-group-item mb-3">
            <div className="mb-2">
              <strong>Current Details:</strong>
              <div>Title: {p.title}</div>
              <div>Group: {p.group?.name || "N/A"}</div>
              <div>Approved: {p.approved ? "Yes" : "No"}</div>
              <div>
                Supervisors: {p.supervisors.map((s) => s.phone).join(", ") || "None"}
              </div>
              <div>Max Chapters: {p.max_chapters || "N/A"}</div>
              <div>Deadline: {p.submission_deadline ? new Date(p.submission_deadline).toLocaleString() : "N/A"}</div>
            </div>

            <div className="mb-2">
              <button
                className={`btn btn-sm mb-2 ${p.approved ? "btn-outline-danger" : "btn-outline-success"}`}
                onClick={() => toggleApproval(p)}
              >
                {p.approved ? "Disapprove" : "Approve"}
              </button>

              <div className="mb-2">
                <label className="form-label">Supervisors:</label>
                <div>
                  {supervisors.map((s) => (
                    <div key={s.id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={p.localSupervisors.includes(s.id)}
                        onChange={() => handleSupervisorToggle(p.id, s.id)}
                        id={`supervisor-${p.id}-${s.id}`}
                      />
                      <label className="form-check-label" htmlFor={`supervisor-${p.id}-${s.id}`}>
                        {s.phone} ({s.role})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label">Max Chapters:</label>
                <input
                  type="number"
                  value={p.localMaxChapters}
                  className="form-control form-control-sm"
                  onChange={(e) => handleMaxChaptersChange(p.id, e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Deadline:</label>
                <input
                  type="datetime-local"
                  value={p.localDeadline}
                  className="form-control form-control-sm"
                  onChange={(e) => handleDeadlineChange(p.id, e.target.value)}
                />
              </div>

              {/* Displaying the Proposal File */}
              <div>
                Proposal: {p.proposals && p.proposals.length > 0 ? (
                  p.proposals.map((proposal) => (
                    <div key={proposal.version_number}>
                      <a href={proposal.file_url} target="_blank" rel="noopener noreferrer">
                        View Proposal Version {proposal.version_number}
                      </a>
                    </div>
                  ))
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;
