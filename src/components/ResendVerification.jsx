import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/auth/resend-verification', { email });
      toast.success('📨 Verification link resent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Could not resend link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <h2>Resend Verification Link</h2>
      <form onSubmit={handleResend}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Resend Link'}
        </button>
      </form>
    </div>
  );
};

export default ResendVerification;
