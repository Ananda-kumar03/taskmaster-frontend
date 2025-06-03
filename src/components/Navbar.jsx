import { Link,useNavigate } from 'react-router-dom';
import React, { useState ,useRef, useEffect } from 'react';

const Navbar = ({ logout , user }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
   const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.firstName
    ? `${user.firstName[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : user?.username?.[0]?.toUpperCase() || '?';

useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav style={{
      background: '#1e1e1e',
      color: '#fff',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2 style={{ margin: 0 ,color:'white'}}>🧠 TaskMaster</h2>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/" style={{ color: '#61dafb', textDecoration: 'none' }}>Home</Link>
        <Link to="/profile" style={{ color: '#61dafb', textDecoration: 'none' }}>My Profile</Link>
        <Link to="/how-to-use" style={{ color: '#61dafb', textDecoration: 'none' }}>How to Use</Link>
        <Link to="/reflection" style={{ color: '#61dafb', textDecoration: 'none' }}>Reflection</Link>
        <Link to="/feedback" style={{ color: '#61dafb', textDecoration: 'none' }}>Feedback</Link>
       <div className="avatar-menu" ref={menuRef}>
          <div className="avatar-circle" onClick={() => setMenuOpen(prev => !prev)}>
 {user?.profileImage ? (
  <img
    src={user.profileImage}
    alt="Avatar"
    className="navbar-avatar"
    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
  />
) : (
  <div className="navbar-avatar initials-avatar">
    {initials}
  </div>
)}



</div>


          <div className={`dropdown-menu fade-slide ${menuOpen ? 'show' : ''}`}>
  <div className="dropdown-info">
    <strong>{user?.firstName} {user?.lastName}</strong>
    <span>{user?.email}</span>
  </div>
  <hr />
  <button onClick={handleLogout}>Logout</button>
</div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
