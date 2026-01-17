// src/context/CoordinatorContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axios";

export const CoordinatorContext = createContext();

export const CoordinatorProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [overview, setOverview] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsRes, supervisorsRes, overviewRes] = await Promise.all([
        API.get("/coordinator/projects/"),
        API.get("/coordinator/supervisors/"),
        API.get("/coordinator/project-overview/"),
      ]);

      const editableProjects = projectsRes.data.map((p) => ({
        ...p,
        localSupervisors: p.supervisors.map((s) => s.id),
        localMaxChapters: p.max_chapters || "",
        localDeadline: p.submission_deadline
          ? new Date(p.submission_deadline).toISOString().slice(0, 16)
          : "",
      }));

      setProjects(editableProjects);
      setSupervisors(supervisorsRes.data);
      setOverview(overviewRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateProject = async (projectId, data) => {
    try {
      await API.patch(`/coordinator/projects/${projectId}/`, data);
      await fetchData(); // refetch both projects and overview
    } catch (err) {
      console.error(err);
      setError("Failed to update project");
    }
  };

  return (
    <CoordinatorContext.Provider
      value={{
        projects,
        overview,
        supervisors,
        loading,
        error,
        updateProject,
      }}
    >
      {children}
    </CoordinatorContext.Provider>
  );
};
