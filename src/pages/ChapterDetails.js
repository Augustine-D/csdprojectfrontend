import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import SupervisorLayout from "../components/SupervisorLayout";
import { Spinner, Alert, Button, Form } from "react-bootstrap";
import "./ChapterDetails.css";

const ChapterDetails = () => {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await API.get(`/lecturers/supervisor/chapter/${chapterId}/`);
        setChapter(res.data.chapter || res.data);
        setSubmissions(res.data.submissions || []);
      } catch {
        setError("Failed to load chapter details.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);

  const submitComment = async () => {
    if (!newFile && !newComment) return alert("Please write a comment or attach a file.");

    const formData = new FormData();
    if (newFile) formData.append("file", newFile);
    if (newComment) formData.append("comment", newComment);

    try {
      const res = await API.post(
        `/lecturers/supervisor/chapter/${chapterId}/submission/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSubmissions([res.data, ...submissions]);
      setNewFile(null);
      setNewComment("");
    } catch {
      alert("Failed to submit.");
    }
  };

  const toggleSubmission = async (id) => {
    try {
      await API.post(`/lecturers/supervisor/submission/${id}/toggle/`);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_open: !s.is_open } : s))
      );
    } catch {
      alert("Could not update comment status.");
    }
  };

  if (loading) {
    return (
      <SupervisorLayout title="Chapter Details">
        <div className="d-flex justify-content-center py-5"><Spinner /></div>
      </SupervisorLayout>
    );
  }

  if (error) {
    return (
      <SupervisorLayout title="Chapter Details">
        <Alert variant="danger" className="mt-3">{error}</Alert>
      </SupervisorLayout>
    );
  }

  return (
    <SupervisorLayout title={chapter.title}>
      <div className="container chapter-details-container">

        {/* Chapter Header Card */}
        <div className="chapter-card shadow-sm mb-4">
          <h3 className="fw-bold">{chapter.title}</h3>
          <p className="text-muted">{chapter.description || "No description provided."}</p>
          <div className="small text-secondary">
            Created on: {new Date(chapter.created_at).toLocaleString()}
          </div>
        </div>

        {/* Create New Submission */}
        <div className="comment-form shadow-sm p-3 mb-4">
          <h5 className="fw-semibold mb-3">Add Comment</h5>

          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="file"
              onChange={(e) => setNewFile(e.target.files[0])}
            />
          </Form.Group>

          <Button variant="primary" className="px-4" onClick={submitComment}>
            Post
          </Button>
        </div>

        {/* Submission List */}
        <h5 className="fw-semibold mb-3">Comments</h5>

        {submissions.length === 0 ? (
          <p className="text-muted fst-italic">No comments yet.</p>
        ) : (
          submissions.map((s) => (
            <div key={s.id} className="submission-card shadow-sm mb-3 p-3">
              <div className="d-flex justify-content-between">
                <strong>
                  {s.uploaded_by_details?.first_name} {s.uploaded_by_details?.last_name}
                </strong>
                <small className="text-muted">{new Date(s.submitted_at).toLocaleString()}</small>
              </div>

              <p className="mt-2">{s.comment}</p>

              {s.file && (
                <a href={s.file} download className="btn btn-outline-dark btn-sm mb-2">
                  Download Attachment
                </a>
              )}

              <Button
                size="sm"
                variant={s.is_open ? "outline-danger" : "outline-success"}
                onClick={() => toggleSubmission(s.id)}
              >
                {s.is_open ? "Close Comment" : "Reopen Comment"}
              </Button>
            </div>
          ))
        )}
      </div>
    </SupervisorLayout>
  );
};

export default ChapterDetails;
