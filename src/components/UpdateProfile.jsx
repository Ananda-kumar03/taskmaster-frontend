// src/pages/UpdateProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    username: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setFormData(res.data))
      .catch((err) => toast.error('Failed to fetch profile data'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Profile updated successfully!');
    } catch (err) {
      toast.error('❌ Failed to update profile');
    }
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setFormData(prev => ({ ...prev, profileImage: reader.result }));
  };
  reader.readAsDataURL(file);
};


  return (
    <div className="page-content profile-page">
      <h2>✏️ Edit Profile</h2>
      {formData.profileImage && (
  <img
    src={formData.profileImage}
    alt="Preview"
    style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '10px',marginBottom: '10px',marginLeft: '5rem' }}
  />
)}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="file-upload-wrapper">
  <label htmlFor="profileImage" className="custom-file-upload">
    Choose Profile Image:
  </label>
  <input
    id="profileImage"
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
  />
</div>

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
