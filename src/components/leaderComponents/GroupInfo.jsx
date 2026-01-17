import React, { useEffect, useState } from "react";
import API from "../../api/axios";


const GroupInfo = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    setLoading(true);
    try {
      const res = await API.get("/students/leader/dashboard/");
      setGroup(res.data.group);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load group info");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading group info...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!group) return <p>You are not assigned to any group yet.</p>;

  return (
    <div className="mb-4">
      <h5>Group Info</h5>
      <p><strong>Name:</strong> {group.name}</p>
      <p><strong>Token:</strong> {group.token || "N/A"}</p>

      <h6>Members:</h6>
      {group.members.length ? (
        <ul>
          {group.members.map((member) => (
            <li key={member.id}>
              {member.phone} ({member.index_number || "No Index"})
            </li>
          ))}
        </ul>
      ) : (
        <p>No members in your group yet.</p>
      )}
    </div>
  );
};

export default GroupInfo;
