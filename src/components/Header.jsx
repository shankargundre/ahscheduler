import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // optional for styling
import logo from '../assets/logo.png'

function Header({ username, onLogout }) {
      const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/ahscheduler'); // Redirects to `/` after logout
  };

  return (
<div className="header-bar">
  <div className="header-left">  <img src={logo} alt="Logo" style={{ height: '45px', objectFit: 'contain' }}/> </div>
  <div className="header-center">Welcome, {username}</div>
  <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
</div>
  );
}

export default Header;
