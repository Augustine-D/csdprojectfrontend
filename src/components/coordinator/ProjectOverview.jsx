import React, { useContext } from "react";
import { CoordinatorContext } from "../../context/CoordinatorContext";

const ProjectOverview = () => {
  const { overview, loading, error } = useContext(CoordinatorContext);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card p-3">
      <h5 className="text-primary mb-3">ACTIVE ALLOCATIONSS</h5>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Supervisor</th>
            <th>Total Projects</th>
            <th>Total Students</th>
          </tr>
        </thead>
        <tbody>
          {overview.map((sup) => (
            <tr key={sup.supervisor_id}>
              <td>{sup.supervisor_name}</td>
              <td>{sup.total_projects}</td>
              <td>{sup.total_students}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectOverview;
