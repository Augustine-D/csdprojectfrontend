import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/students/leader/dashboard/");
      setNotifications(res.data.notifications);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!notifications.length) return <p>No notifications yet.</p>;

  return (
    <div>
      <h5>Notifications</h5>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <strong>{n.sent_via}:</strong> {n.message}{" "}
            <em>({new Date(n.created_at).toLocaleString()})</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
