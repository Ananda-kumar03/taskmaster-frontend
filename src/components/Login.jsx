import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../components/stylesls.css'; // Ensure styles are linked
// import '../components/styles.css'; // Ensure styles are linked
function Login({ login }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [identifier, setIdentifier] = useState('');


    const { from } = location.state || { from: { pathname: '/' } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { identifier, password });
            login(response.data.token, response.data.userId);
            navigate(from, { replace: true });
            toast.success('🔓 Logged in successfully!', {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: true,
  theme: 'colored'
});
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="Login">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="identifier">Email or Username:</label>
<input
  type="text"
  id="identifier"
  value={identifier}
  onChange={(e) => setIdentifier(e.target.value)}
  required
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
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
            <p>
  <Link to="/forgot-password">Forgot your password?</Link>
</p>
<p>
  <Link to="/resend-verification">Resend verification email</Link>
</p>

        </div>
    );
}

export default Login;