import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="Logo" className="logo-image" />
        <h1>Gamificação</h1>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        <Link to="/dashboard/ranking-geral" className={`nav-item ${location.pathname === '/dashboard/ranking-geral' ? 'active' : ''}`}>
          <i className="fas fa-trophy"></i>
          <span>Ranking Geral</span>
        </Link>
        <Link to="/dashboard/ranking-por-times" className={`nav-item ${location.pathname === '/dashboard/ranking-por-times' ? 'active' : ''}`}>
          <i className="fas fa-users"></i>
          <span>Times</span>
        </Link>
        <Link to="/dashboard/metricas-pessoais" className={`nav-item ${location.pathname === '/dashboard/metricas-pessoais' ? 'active' : ''}`}>
          <i className="fas fa-chart-line"></i>
          <span>Métricas Pessoais</span>
        </Link>
        <Link to="/dashboard/loja-de-troca" className={`nav-item ${location.pathname === '/dashboard/loja-de-troca' ? 'active' : ''}`}>
          <i className="fas fa-store"></i>
          <span>Loja de Troca</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;