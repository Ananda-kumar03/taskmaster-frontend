// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      toast.success("🔐 Password reset successfully!");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Password reset failed");
    }
  };

  return (
    <div className="page-content">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <div>
          <label>New Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
