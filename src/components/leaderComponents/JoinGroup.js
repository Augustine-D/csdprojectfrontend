import React, { useState } from 'react';
import API from '../../api/axios';  // Axios instance

const JoinGroup = () => {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await API.post('students/join-group/', { token });
      setMessage(response.data.success);  // Show success message
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);  // Show error message
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm rounded-lg bg-white p-4">
        <h3 className="text-center mb-4">Join a Group</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="token">Group Token</label>
            <input
              type="text"
              id="token"
              className="form-control"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Join Group</button>
        </form>
      </div>
    </div>
  );
};

export default JoinGroup;
