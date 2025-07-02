import React from 'react';
import { useParams, Navigate, Outlet, Link } from 'react-router-dom';
import Header from './Header';

const ProtectedLayout = ({ isLoggedIn, username, onLogout }) => {
  const { instance } = useParams();

  // If not logged in, bounce back to the proper login URL
  if (!isLoggedIn) {
    return <Navigate to={`/ahscheduler/${instance}/login`} replace />;
  }

  return (
    <div className="app-container">
      <Header username={username} onLogout={onLogout} />
      <div className="main-content">
        <nav className="sidebar">
          <h3>Crave API scheduler </h3>
          <ul>
            <li>
              <Link to={`/ahscheduler/${instance}`}>📅 Schedule Job</Link>
            </li>
            <li>
              <Link to={`/ahscheduler/${instance}/jobdetail`}>📄 Job Detail</Link>
            </li>
            <li>
              <Link to={`/ahscheduler/${instance}/jobrun`}>🔁 Job Runs</Link>
            </li>
            <li>
              <Link to={`/ahscheduler/${instance}/logs`}>🧾 Application Logs</Link>
            </li>
          </ul>
        </nav>
        <div className="content">
          {/* Renders whichever child route is active */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
