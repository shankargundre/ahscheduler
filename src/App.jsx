import { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ProtectedLayout from './components/ProtectedLayout';
import JobAndApplicationDetailForm from './components/JobAndApplicationDetailForm';
import ScheduledJobsTable from './components/ScheduledJobsTable';
import JobRunStatus from './components/JobRunStatus';
import LogDownloader from './components/LogDownloader';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername]   = useState('');
  const [jobs, setJobs]           = useState([]);
  const [statuses, setStatuses]   = useState([]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('username');
    const token      = localStorage.getItem('authToken');
    if (storedUser && token) {
      setUsername(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
    sessionStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
    sessionStorage.removeItem('username');
    localStorage.removeItem('authToken');
  };

  const handleSchedule = (job) => {
    setJobs([...jobs, job]);
    setStatuses([
      ...statuses,
      { job: job.jobName, status: 'Scheduled', lastRun: 'N/A' }
    ]);
  };

 return (
    <Router>
      <Routes>
        {/*
          1️⃣ LOGIN ROUTE (must come first)
        */}
        <Route
          path="/ahscheduler/:instance/login"
          element={<LoginForm onLogin={handleLogin} />}
        />

        {/*
          2️⃣ PROTECTED ROUTES (only match anything *after* /login)
        */}
        <Route
          path="/ahscheduler/:instance/*"
          element={
            <ProtectedLayout
              isLoggedIn={isLoggedIn}
              username={username}
              onLogout={handleLogout}
            />
          }
        >
          <Route
            index
            element={<JobAndApplicationDetailForm onSchedule={handleSchedule} />}
          />
          <Route path="jobdetail" element={<ScheduledJobsTable jobs={jobs} />} />
          <Route path="jobrun" element={<JobRunStatus statuses={statuses} />} />
          <Route path="logs" element={<LogDownloader />} />
        </Route>

        {/*
          3️⃣ CATCH‑ALL: redirect everything else to your default login
        */}
        <Route
          path="*"
          element={<Navigate to="/ahscheduler/DEVINST/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
