import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../components/styles.css' // Create this file for styling

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  const initials = user?.firstName
    ? `${user.firstName[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : user?.username?.[0]?.toUpperCase() || '?';

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(err => console.error('Failed to fetch profile:', err));
  }, []);

  if (!user) return <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p style={{ marginLeft: '10px' }}>Loading profile...</p>
      </div>;

  return (
    <div className="page-content profile-page">
      <h2>👤 My Profile</h2>
      <div className="profile-card">
        {user.profileImage ? (
  <img
    src={user.profileImage}
    alt="Profile"
    className="profile-picture"
    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem',marginLeft: '6rem' }}
  />
) : (
  <div className="initials-avatar">
   {initials}
  </div>
)}

        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>
      <Link to="/update-profile">Edit Profile</Link>
    </div>
  );
};

export default ProfilePage;
