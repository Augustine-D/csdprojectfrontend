import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const ProjectStats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get("/coordinator/stats/") // ✅ updated endpoint
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error("Error fetching project stats:", err.response ? err.response.data : err);
        setError("Could not load project stats");
      });
  }, []);

  if (error) return <div className="text-danger">{error}</div>;
  if (!stats) return <div>Loading project stats...</div>;

  return (
    <div className="card shadow-sm p-3">
      <h5 className="text-primary">ACTIVE PROJECTS OVERVIEW</h5>
      <p>Total Projects: {stats.total}</p>
      <p>Ongoing: {stats.ongoing}</p>
      <p>Completed: {stats.completed}</p>
    </div>
  );
};

export default ProjectStats;
