import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../components/stylesls.css';
function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [phone, setPhone] = useState('');
const [email, setEmail] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, { username, password, email, firstName,
  lastName,
  phone });
            setSuccessMessage(res.data.message);

  toast.success(res.data.message, {
    position: 'top-right',
    autoClose: 3000,
    theme: 'colored',
  });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="Register">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
  <label htmlFor="firstName">First Name:</label>
  <input
    type="text"
    id="firstName"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    required
  />
</div>

<div>
  <label htmlFor="lastName">Last Name:</label>
  <input
    type="text"
    id="lastName"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    required
  />
</div>

<div>
  <label htmlFor="phone">Phone:</label>
  <input
    type="text"
    id="phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    required
  />
</div>

                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
  <label htmlFor="email">Email:</label>
  <input
  type="email"
  id="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  title="Enter a valid email address"
/>

</div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Register;