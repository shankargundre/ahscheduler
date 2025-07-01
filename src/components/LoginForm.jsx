import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getInstanceFromPath } from '../utils/getInstanceFromPath';
import logo from '../assets/logo.png'
const LoginForm = ({ onLogin }) => {
  const { instance } = useParams(); // e.g. DEVINST, PRODINST
  const resolvedInstance = instance || getInstanceFromPath();
    const navigate = useNavigate();
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
 const apiUrl = window._env_.API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log("Instance from URL:", instance);
      const response = await axios.post(
       `${apiUrl}/RequestJWTToken/TokenProvider/requestToken`,
        {
          requestToken: {
            registeredAppName: resolvedInstance,
            userid,
            password
          }
        }
      );

      const token = response?.data?.tokenResponse?.accessToken;

      if (token) {
        localStorage.setItem('authToken', token);
        onLogin(userid); // tell App you're logged in
       navigate(`/ahscheduler/${instance}`, { replace: true });
      } else {
        setError('Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check credentials or server connection.');
    }
  };

  return (
    <div className="login-container">
            <div className="login-side">
        <img
          src={logo}
          alt="AccessHub Logo"
          className="login-logo"
        />
      </div>
      <h2>Login to {instance} Tenant</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
