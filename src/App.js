import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Background from './components/Background';
import AnimatedRoutes from './components/AppContainer';
import Login from './components/Login';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <Background />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Background />
        <header className="dashboard-header">
          <div className="header-left">
            <h2 className="dashboard-title">Gamificação</h2>
          </div>
          <nav className="dashboard-nav">
            <Link to="/">Home</Link>
            <Link to="/dashboard/ranking-geral">Ranking Geral</Link>
            <Link to="/dashboard/ranking-por-times">Ranking por Times</Link>
          </nav>
        </header>
        <main className="main-content">
          <AnimatedRoutes username={username} />
        </main>
      </div>
    </Router>
  );
};

export default App;