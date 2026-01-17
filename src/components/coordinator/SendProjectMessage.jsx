// src/components/coordinator/SendProjectMessage.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const SendProjectMessage = () => {
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: "success" | "danger" | "warning", text: string }

  useEffect(() => {
    fetchProjects();
    fetchGroups();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/coordinator/projects/");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: "Failed to load projects." });
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await API.get("/groups/"); // Adjust if your endpoint differs
      setGroups(res.data);
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: "Failed to load groups." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setAlert({ type: "warning", text: "Message cannot be empty." });
      return;
    }

    if (!selectedProject && !selectedGroup) {
      setAlert({ type: "warning", text: "Please select a project or a group." });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const payload = {
        message,
        ...(selectedProject ? { project_id: selectedProject } : {}),
        ...(selectedGroup ? { group_id: selectedGroup } : {}),
      };

      const res = await API.post("/coordinator/send-message/", payload);

      setAlert({ type: "success", text: res.data.detail || "Message sent successfully!" });
      setMessage("");
      setSelectedProject("");
      setSelectedGroup("");
    } catch (err) {
      console.error(err);
      setAlert({
        type: "danger",
        text: err.response?.data?.detail || "Failed to send project message.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-3 mb-3">
      <h5 className="text-primary mb-3">SEND PROJECT MESSAGE</h5>

      {alert && (
        <div className={`alert alert-${alert.type} py-2`} role="alert">
          {alert.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        {/* Project Dropdown */}
        <div>
          <label className="form-label small text-muted mb-1">
            Select Project (optional)
          </label>
          <select
            className="form-select form-select-sm"
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setSelectedGroup("");
            }}
          >
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Group Dropdown */}
        <div>
          <label className="form-label small text-muted mb-1">
            Or Select Group (optional)
          </label>
          <select
            className="form-select form-select-sm"
            value={selectedGroup}
            onChange={(e) => {
              setSelectedGroup(e.target.value);
              setSelectedProject("");
            }}
          >
            <option value="">-- Select Group --</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Message Box */}
        <div>
          <label className="form-label small text-muted mb-1">
            Message Content
          </label>
          <textarea
            className="form-control form-control-sm"
            rows={4}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <small className="text-muted">
            💬 This message will be sent via SMS to all group members,
            supervisors, and project leaders.
          </small>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-sm btn-success"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default SendProjectMessage;
