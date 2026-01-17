import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import LeaderLayout from "../../pages/LeaderLayout"; // Assuming LeaderLayout is a layout component

const ChapterSubmissionComponent = () => {
  const { projectId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [project, setProject] = useState(null);
  const [group, setGroup] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [file, setFile] = useState(null);
  const [contribution, setContribution] = useState(""); 
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  // Fetch Chapter and Project Details
  useEffect(() => {
    const fetchChapterDetails = async () => {
      try {
        const res = await API.get(`/students/leader/projects/${projectId}/chapters/${chapterId}/`);
        setChapter(res.data.chapter);
        setProject(res.data.project);
        setGroup(res.data.group);
        setSubmissions(res.data.submissions);
      } catch (err) {
        setError("Failed to fetch chapter details.");
      }
    };
    fetchChapterDetails();
  }, [projectId, chapterId]);

  // Handle Contribution Submission
  const handleSubmit = async () => {
    if (!file && !contribution) {
      setError("Please add a contribution or select a file.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("comment", contribution);  // Changed 'contribution' to 'comment'

    try {
      const res = await API.post(`/students/leader/projects/${projectId}/chapters/${chapterId}/submit/`, formData);
      setStatus("Contribution submitted successfully!");
      setFile(null);
      setContribution(""); 

      const updatedRes = await API.get(`/students/leader/projects/${projectId}/chapters/${chapterId}/`);
      setSubmissions(updatedRes.data.submissions);
    } catch (err) {
      setError("Failed to submit contribution.");
    }
  };

  return (
    <LeaderLayout>
      <div className="container mt-5">
        <div className="card shadow-sm rounded-lg bg-white p-4">
          {/* Chapter Header */}
          <div className="mb-4 d-flex justify-content-between align-items-center border-bottom pb-3">
            {project && group && (
              <div>
                <h4 className="text-xl font-weight-bold text-dark">{project.title}</h4>
                <p className="text-muted">Group: {group.name}</p>
              </div>
            )}
            <div>
              <span className="text-muted">Chapter: {chapter?.title}</span>
            </div>
          </div>

          {/* Display error and success messages */}
          {error && <div className="alert alert-danger">{error}</div>}
          {status && <div className="alert alert-success">{status}</div>}

          {/* Display previous submissions */}
          <div>
            <h5 className="mt-4 mb-3">Contributions</h5>
            {submissions.length === 0 ? (
              <p>No contributions yet.</p>
            ) : (
              <ul className="list-unstyled">
                {submissions.map((submission) => (
                  <li key={submission.id} className="submission-item mb-4 fadeIn">
                    <div className="card shadow-sm p-3 rounded">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{submission.uploaded_by_full_name}</strong>
                          <small className="text-muted ms-2">
                            {new Date(submission.submitted_at).toLocaleString()}
                          </small>
                        </div>
                      </div>

                      {/* Display Index Number */}
                      <div className="mt-2">
                        <small className="text-muted">Index Number: {submission.uploaded_by_index_number}</small>
                      </div>

                      {/* Display Contribution Comment */}
                      {submission.comment && <p className="mt-2">{submission.comment}</p>} {/* Changed 'contribution' to 'comment' */}

                      {/* Display file download if available */}
                      {submission.file_url && (
                        <a
                          href={submission.file_url}
                          download
                          className="btn btn-link text-primary mt-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download Attachment
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit New Contribution Form */}
          <div className="submit-form mt-5">
            <h5>Submit a New Contribution</h5>
            <div className="form-group mt-3">
              <label className="form-label">Select File</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div className="form-group mt-3">
              <label className="form-label">Contribution</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Add your contribution..."
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="btn btn-primary mt-4 w-100"
            >
              Submit Contribution
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* Smooth Fade In Animation */
        .fadeIn {
          animation: fadeIn 1s ease-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        /* Button Hover Effect */
        .hover\:bg-indigo-700:hover {
          background-color: #4f46e5;
        }
      `}</style>
    </LeaderLayout>
  );
};

export default ChapterSubmissionComponent;
