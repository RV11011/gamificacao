import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Background from './components/Background';
import AnimatedRoutes from './components/AppContainer';
import Login from './components/Login';
import ParticlesBackground from './components/ParticlesBackground';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.removeItem('username');
  };

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <ParticlesBackground />
        <Background />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <ParticlesBackground />
        <Background />
        <Sidebar />
        <div className="main-content">
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
          <AnimatedRoutes username={username} />
        </div>
      </div>
    </Router>
  );
};

export default App;