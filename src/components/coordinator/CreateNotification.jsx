import React, { useState } from "react";
import axios from "axios";

const CreateNotification = ({ token }) => {
  const [message, setMessage] = useState("");
  const [groupId, setGroupId] = useState("");
  const [memberIds, setMemberIds] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    // Prepare payload
    const payload = {
      message,
      ...(groupId && { group_id: groupId }),
      ...(memberIds && { member_ids: memberIds.split(",").map(id => parseInt(id.trim())) }),
      ...(recipientId && { recipient_id: parseInt(recipientId) })
    };

    try {
      const response = await axios.post(
        "/api/notifications/create/", // Adjust API path if different
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setStatus(`Notifications created: ${response.data.notification_ids.join(", ")}`);
      setMessage("");
      setGroupId("");
      setMemberIds("");
      setRecipientId("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to create notification.");
    }
  };

  return (
    <div className="create-notification">
      <h2>Create Notification</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
          />
        </div>

        <div>
          <label>Group ID (optional):</label>
          <input
            type="number"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          />
        </div>

        <div>
          <label>Member IDs (comma-separated, optional):</label>
          <input
            type="text"
            value={memberIds}
            onChange={(e) => setMemberIds(e.target.value)}
          />
        </div>

        <div>
          <label>Recipient ID (optional):</label>
          <input
            type="number"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          />
        </div>

        <button type="submit">Send Notification</button>
      </form>

      {status && <p style={{ color: "green" }}>{status}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateNotification;
