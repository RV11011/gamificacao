import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login';
import ParticlesBackground from './components/ParticlesBackground';
import './App.css';

const Sidebar = lazy(() => import('./components/Sidebar'));
const Background = lazy(() => import('./components/Background'));
const AnimatedRoutes = lazy(() => import('./components/AppContainer'));

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
    <Suspense fallback={<div>Carregando...</div>}>
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
    </Suspense>
  );
};

export default App;