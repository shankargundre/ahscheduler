
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.jsx';

// Fetch config from public/config.json before rendering the app
fetch(`/ahscheduler/config.json?ts=${new Date().getTime()}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to load config.json');
    }
    return response.json();
  })
  .then((config) => {
    // Store config globally
    window._env_ = config;

    // Render app only after config is loaded
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  })
  .catch((error) => {
    console.error('❌ Could not load config:', error);
    // Optional: Render an error message or fallback UI
    document.getElementById('root').innerHTML = `<h2 style="color:red;">App failed to load config.</h2>`;
  });

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './App.css';
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
