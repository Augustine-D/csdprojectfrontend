import React, { useState, useEffect, useCallback } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const LeaderProjectManager = () => {
  const navigate = useNavigate();

  // -----------------------
  // STATE
  // -----------------------
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parentProject, setParentProject] = useState(null);
  const [availableParents, setAvailableParents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // FILES STATE
  const [files, setFiles] = useState({
    brief_pdf: null,
    diary_pdf: null,
    assessment_file: null,
    assessment_form_file: null,
  });

  // FEATURE STATE
  const [features, setFeatures] = useState([]);
  const [newFeatureName, setNewFeatureName] = useState("");
  const [newFeatureDescription, setNewFeatureDescription] = useState("");
  const [editingFeature, setEditingFeature] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [chapters, setChapters] = useState([]);

  // --------------------------
  // FETCH INITIAL DATA
  // --------------------------
  useEffect(() => {
    fetchProject();
    fetchApprovedProjects();
    fetchCategories();
  }, []);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await API.get("/students/leader/projects/");
      if (res.data.length > 0) {
        const proj = res.data[0];
        setProject(proj);
        setTitle(proj.title || "");
        setDescription(proj.description || "");
        setParentProject(proj.parent_project || null);
        setSelectedCategory(proj.category || null);
      } else {
        setError("No project found for this leader.");
      }
    } catch {
      setError("Failed to load project.");
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedProjects = async () => {
    try {
      const res = await API.get("/students/leader/completed-projects/");
      setAvailableParents(res.data || []);
    } catch {
      setError("Failed to load approved projects.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/students/categories/");
      setCategories(res.data || []);
    } catch {
      setError("Failed to load categories.");
    }
  };

  const fetchChapters = async () => {
    if (!project?.id) return;
    try {
      const res = await API.get(`/students/leader/projects/${project.id}/chapters/`);
      setChapters(res.data?.chapters || []);
    } catch {
      setError("Failed to load chapters.");
    }
  };

  const fetchFeatures = async () => {
    if (!project?.id) return;
    try {
      const res = await API.get(`/students/leader/features/?project_pk=${project.id}`);
      setFeatures(res.data);
    } catch {
      setError("Failed to load features.");
    }
  };

  useEffect(() => {
    if (project?.id) {
      fetchChapters();
      fetchFeatures();
    }
  }, [project]);

  // -------------------------
  // AUTO-SAVE PROJECT CHANGES
  // -------------------------
  const saveProject = useCallback(
    async (data) => {
      if (!project || project.approved) return;
      try {
        setSaving(true);
        setStatus("Saving...");
        const res = await API.patch(`/students/leader/projects/${project.id}/`, data);
        setProject(res.data);
        setStatus("All changes saved.");
      } catch {
        setError("Failed to save changes.");
      } finally {
        setSaving(false);
        setTimeout(() => setStatus(""), 2000);
      }
    },
    [project]
  );

  useEffect(() => {
    if (!project || project.approved) return;

    const handler = setTimeout(() => {
      if (
        title !== project.title ||
        description !== project.description ||
        parentProject?.id !== project.parent_project?.id ||
        selectedCategory?.id !== project.category?.id
      ) {
        saveProject({
          title,
          description,
          parent_project: parentProject?.id || null,
          category: selectedCategory?.id || null,
        });
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [title, description, parentProject, selectedCategory, project, saveProject]);

  // -------------------------
  // CREATE / DELETE PROJECT
  // -------------------------
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/students/leader/projects/", {
        title,
        description,
        parent_project: parentProject?.id || null,
        category: selectedCategory?.id || null,
      });
      setProject(res.data);
      setStatus("Project created successfully!");
    } catch {
      setError("Error creating project.");
    }
  };

  const handleDelete = async () => {
    if (!project || project.approved) return alert("Cannot delete an approved project.");
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await API.delete(`/students/leader/projects/${project.id}/`);
      setProject(null);
      setStatus("Project deleted successfully!");
    } catch {
      setError("Failed to delete project.");
    }
  };

  // -------------------------
  // MULTIPLE FILE UPLOAD
  // -------------------------
  const handleFilesChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
  };

  const handleProjectFilesUpload = async (e) => {
    e.preventDefault();
    if (!project) return;

    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
 const res = await API.post(
  `/students/leader/projects/${project.id}/files/`,
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);

      setProject(res.data);
      setStatus("Files uploaded successfully!");
      setFiles({
        brief_pdf: null,
        diary_pdf: null,
        assessment_file: null,
        assessment_form_file: null,
      });
    } catch {
      setError("Failed to upload files.");
    }
  };

  // -------------------------
  // CHAPTER NAVIGATION
  // -------------------------
  const handleChapterClick = (id) =>
    navigate(`/students/leader/projects/${project.id}/chapters/${id}/submission`);

  const handleWorkOnChapter = handleChapterClick;

  // -------------------------
  // FEATURES CRUD
  // -------------------------
  const handleAddFeature = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/students/leader/features/?project_pk=${project.id}`, {
        name: newFeatureName,
        description: newFeatureDescription,
      });
      setFeatures([...features, res.data]);
      setNewFeatureName("");
      setNewFeatureDescription("");
      setStatus("Feature added!");
    } catch {
      setError("Failed to add feature.");
    }
  };

  const startEditing = (f) => {
    setEditingFeature(f.id);
    setEditName(f.name);
    setEditDescription(f.description);
  };

  const handleUpdateFeature = async (id) => {
    try {
      const res = await API.patch(
        `/students/leader/features/${id}/?project_pk=${project.id}`,
        { name: editName, description: editDescription }
      );
      setFeatures(features.map((f) => (f.id === id ? res.data : f)));
      setEditingFeature(null);
      setStatus("Feature updated!");
    } catch {
      setError("Failed to update feature.");
    }
  };

  const handleDeleteFeature = async (id) => {
    if (!window.confirm("Delete this feature?")) return;
    try {
      await API.delete(`/students/leader/features/${id}/?project_pk=${project.id}`);
      setFeatures(features.filter((f) => f.id !== id));
      setStatus("Feature deleted!");
    } catch {
      setError("Failed to delete feature.");
    }
  };

  // -------------------------
  // UI
  // -------------------------
  if (loading) return <p>Loading project info...</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-xl p-6 rounded-xl bg-white">
        <div className="card-body">
          <h5 className="mb-6 text-indigo-600 font-bold text-xl">📁 Project Management</h5>

          {error && <div className="alert alert-danger">{error}</div>}
          {status && <div className={`alert ${saving ? "alert-warning" : "alert-success"}`}>{status}</div>}

          {/* ------------------------- CREATE NEW PROJECT ------------------------- */}
          {!project ? (
            <form onSubmit={handleCreate}>
              <div className="mb-5">
                <label className="form-label text-gray-700">Title</label>
                <input className="form-control p-3" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="mb-5">
                <label className="form-label text-gray-700">Description</label>
                <textarea className="form-control p-3" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="mb-5">
                <label className="form-label text-gray-700">Category</label>
                <select className="form-select p-3" value={selectedCategory?.id || ""} onChange={(e) => {
                  const selected = categories.find((c) => c.id === parseInt(e.target.value));
                  setSelectedCategory(selected || null);
                }}>
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="mb-5">
                <label className="form-label">Advance from Completed Project</label>
                <select className="form-select p-3" value={parentProject?.id || ""} onChange={(e) => {
                  const selected = availableParents.find((p) => p.id === parseInt(e.target.value));
                  setParentProject(selected || null);
                }}>
                  <option value="">-- None --</option>
                  {availableParents.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>

              <button className="btn btn-primary w-full py-3">Create Project</button>
            </form>
          ) : (
            <>
              {/* ------------------------- PROJECT DETAILS ------------------------- */}
              <div className="mb-5">
                <h6 className="text-muted">Project ID: {project.id}</h6>
                <h5 className="font-semibold">{project.title}</h5>
              </div>

              {/* Title */}
              <div className="mb-5">
                <label>Title</label>
                <input className="form-control p-3" disabled={project.approved} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              {/* Description */}
              <div className="mb-5">
                <label>Description</label>
                <textarea className="form-control p-3" rows={4} disabled={project.approved} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              {/* Category */}
              <div className="mb-5">
                <label>Category</label>
                <select className="form-select p-3" disabled={project.approved} value={selectedCategory?.id || ""} onChange={(e) => {
                  const selected = categories.find((c) => c.id === parseInt(e.target.value));
                  setSelectedCategory(selected);
                }}>
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Parent Project */}
              <div className="mb-5">
                <label>Advance from Completed Project</label>
                <select className="form-select p-3" disabled={project.approved} value={parentProject?.id || ""} onChange={(e) => {
                  const selected = availableParents.find((p) => p.id === parseInt(e.target.value));
                  setParentProject(selected);
                }}>
                  <option value="">-- None --</option>
                  {availableParents.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>

              <p><strong>Academic Year:</strong> {project.academic_year_name}</p>
              <p><strong>Status:</strong> {project.approved ? "✅ Approved" : "🕓 Pending Approval"}</p>

              {!project.approved && <button className="btn btn-danger w-full py-3 mt-3" onClick={handleDelete}>Delete Project</button>}

              {/* ------------------------- PROJECT FILES UPLOAD ------------------------- */}
              {!project.approved && (
                <>
                  <hr />
                  <h6 className="mt-5 font-semibold">Upload Project Files</h6>
                  <form onSubmit={handleProjectFilesUpload}>
                    <div className="mb-3">
                      <label>Brief PDF</label>
                      <input type="file" name="brief_pdf" accept=".pdf" className="form-control" onChange={handleFilesChange} />
                    </div>
                    <div className="mb-3">
                      <label>Diary PDF</label>
                      <input type="file" name="diary_pdf" accept=".pdf" className="form-control" onChange={handleFilesChange} />
                    </div>
                    <div className="mb-3">
                      <label>Assessment File</label>
                      <input type="file" name="assessment_file" className="form-control" onChange={handleFilesChange} />
                    </div>
                    <div className="mb-3">
                      <label>Assessment Form File</label>
                      <input type="file" name="assessment_form_file" className="form-control" onChange={handleFilesChange} />
                    </div>
                    <button className="btn btn-secondary w-full" type="submit">Upload Files</button>
                  </form>
                </>
              )}

              {/* ------------------------- CHAPTERS ------------------------- */}
              <h6 className="mt-6 font-semibold">Chapters for {project.title}</h6>
              {chapters.length ? (
                <ul className="list-unstyled">
                  {chapters.map((c) => (
                    <li key={c.id} className="flex justify-between items-center mb-4">
                      <span className="text-indigo-600 cursor-pointer" onClick={() => handleChapterClick(c.id)}>
                        {c.title} - {c.status} {c.completed ? "✔️" : "🔴"} {c.score && <span>- Score: {c.score}</span>}
                      </span>
                      <button className="btn btn-outline-primary px-4" onClick={() => handleWorkOnChapter(c.id)}>Work on Chapter</button>
                    </li>
                  ))}
                </ul>
              ) : (<p>No chapters yet.</p>)}

              {/* ------------------------- FEATURES ------------------------- */}
              <hr className="my-6" />
              <h6 className="text-lg font-semibold">Features</h6>
              {features.length ? (
                <ul className="list-unstyled">
                  {features.map((f) => (
                    <li key={f.id} className="border p-3 mb-3 rounded shadow-sm">
                      {editingFeature === f.id ? (
                        <>
                          <input className="form-control mb-2" value={editName} onChange={(e) => setEditName(e.target.value)} />
                          <textarea className="form-control mb-2" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} />
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdateFeature(f.id)}>Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingFeature(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <strong>{f.name}</strong>
                          <p>{f.description}</p>
                          {!project.approved && (
                            <>
                              <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEditing(f)}>Edit</button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteFeature(f.id)}>Delete</button>
                            </>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (<p>No features yet.</p>)}

              {!project.approved && (
                <form className="mt-4" onSubmit={handleAddFeature}>
                  <h6 className="font-semibold mb-2">Add New Feature</h6>
                  <input className="form-control mb-3" placeholder="Feature name" value={newFeatureName} onChange={(e) => setNewFeatureName(e.target.value)} required />
                  <textarea className="form-control mb-3" placeholder="Feature description" rows={3} value={newFeatureDescription} onChange={(e) => setNewFeatureDescription(e.target.value)} />
                  <button className="btn btn-primary w-full">Add Feature</button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderProjectManager;
