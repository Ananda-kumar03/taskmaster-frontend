// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        toast.success('✅ Email verified!');
        setStatus('success');
        setTimeout(() => {
            window.location.href = '/login'; // Redirect to login after success
            }, 2000);
      } catch (err) {
        toast.error(err.response?.data?.message || '❌ Verification failed');
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="page-content">
      <h2>Email Verification</h2>
      {status === 'verifying' && <p>⏳ Verifying your email...</p>}
      {status === 'success' && <p>🎉 Your email has been verified. You can now log in.</p>}
      {status === 'error' && <p>❌ This link is invalid or expired.</p>}
    </div>
  );
};

export default VerifyEmail;
