// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/request-password-reset`, { email });
      toast.success("📩 Reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Could not send reset link");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <h2>Forgot Password</h2>
      <p>Enter your email to receive a password reset link.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
