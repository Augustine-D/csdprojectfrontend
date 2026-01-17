import React, { useState, useEffect } from "react";
import API from "../../api/axios"; // Your default Axios instance

const ProjectProgress = () => {
  const [projects, setProjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [exportType, setExportType] = useState("");
  const [error, setError] = useState("");

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("coordinator/projects/dropdown/");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch projects.");
      }
    };
    fetchProjects();
  }, []);

  // Fetch chapters when a project is selected
  useEffect(() => {
    if (!selectedProject) {
      setChapters([]);
      setSelectedChapter("");
      return;
    }

    const fetchChapters = async () => {
      try {
        const res = await API.get(
          `coordinator/projects/${selectedProject}/chapters/dropdown/`
        );
        setChapters(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch chapters.");
      }
    };

    fetchChapters();
  }, [selectedProject]);

  // Fetch progress/submissions
  const fetchProgress = async () => {
    if (!selectedProject) return;
    setError("");

    try {
      let url = `coordinator/projects/${selectedProject}/progress/`;
      if (selectedChapter)
        url = `coordinator/projects/${selectedProject}/chapters/${selectedChapter}/progress/`;
      if (exportType) url += `?export=${exportType}`;

      const response = await API.get(url, {
        responseType: exportType ? "blob" : "json", // for file download
      });

      if (exportType) {
        // Trigger download for Excel or PDF
        const blob = new Blob([response.data], {
          type:
            exportType === "excel"
              ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              : "application/pdf",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${selectedProject}_progress.${
          exportType === "excel" ? "xlsx" : "pdf"
        }`;
        link.click();
      } else {
        setSubmissions(response.data.submissions);
        setProgress({
          fraction: response.data.progress_fraction,
          percentage: response.data.progress_percentage,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch project progress.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Project Submissions Progress</h2>

      <div className="mb-3">
        <label htmlFor="projectSelect" className="form-label">Project:</label>
        <select
          id="projectSelect"
          className="form-select"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">-- Select Project --</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.title}
            </option>
          ))}
        </select>
      </div>

      {chapters.length > 0 && (
        <div className="mb-3">
          <label htmlFor="chapterSelect" className="form-label">Chapter (optional):</label>
          <select
            id="chapterSelect"
            className="form-select"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
          >
            <option value="">-- All Chapters --</option>
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="exportSelect" className="form-label">Export as:</label>
        <select
          id="exportSelect"
          className="form-select"
          value={exportType}
          onChange={(e) => setExportType(e.target.value)}
        >
          <option value="">None</option>
          <option value="excel">Excel</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      <button className="btn btn-primary" onClick={fetchProgress}>
        Fetch Progress
      </button>

      {progress && (
        <div className="mt-3">
          <h4>
            Progress: {progress.fraction} ({progress.percentage})
          </h4>
        </div>
      )}

      {submissions.length > 0 && (
        <div className="mt-4">
          <h3>Submissions</h3>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Chapter</th>
                <th>Uploaded By</th>
                <th>Comment</th>
                <th>File</th>
                <th>Score</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr key={idx}>
                  <td>{sub.chapter_title}</td>
                  <td>{sub.uploaded_by_name}</td>
                  <td>{sub.comment}</td>
                  <td>
                    {sub.file ? (
                      <a
                        href={sub.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    ) : (
                      "No file"
                    )}
                  </td>
                  <td>{sub.score}</td>
                  <td>{sub.submitted_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default ProjectProgress;
