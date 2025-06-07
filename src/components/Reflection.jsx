import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Reflection = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats/reflection-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (err) {
        toast.error('Failed to load reflection summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p style={{ marginLeft: '10px' }}>Loading Reflection Summary...</p>
      </div>;
  if (!summary) return null;

  return (
    <div className="page-content">
      <h2>🪞 Reflection & Weekly Review</h2>
      <div className="reflection-grid">
        <div className="card">✅ Tasks Completed: <strong>{summary.completed}</strong></div>
        <div className="card">❌ Tasks Missed: <strong>{summary.missed}</strong></div>
        <div className="card">⏳ Avg. Completion Time: <strong>{summary.avgCompletionTime} hrs</strong></div>
        <div className="card">📌 Top Tags: <strong>{summary.topTags.join(', ')}</strong></div>
        <div className="card">🔁 Recurring Completion Rate: <strong>{summary.recurringRate}%</strong></div>
        <div className="card">🔥 Streak: <strong>{summary.streak} days</strong></div>
      </div>

      <div className="suggestion-box">
        <h4>💬 Suggestion:</h4>
        <p>{summary.suggestion}</p>
      </div>

      <div className="reflection-input">
        <h4>📝 Your Weekly Reflection</h4>
        <textarea placeholder="Write your thoughts here..." rows={5}></textarea>
        <button style={{ marginTop: '10px' }}>Save Reflection</button>
      </div>
    </div>
  );
};

export default Reflection;
