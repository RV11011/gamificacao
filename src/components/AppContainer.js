import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';
import RankingGeral from './RankingGeral';
import RankingPorTimes from './RankingPorTimes';
import PersonalMetrics from './PersonalMetrics';
import LojaDeTroca from './LojaDeTroca'; // Import the new component
import './AppContainer.css';

const AppContainer = ({ username }) => {
  const location = useLocation();
  const isAuthenticated = !!username;

  return (
    <div className="route-section">
      <Routes location={location}>
        <Route path="/" element={isAuthenticated ? <Home username={username} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}>
          <Route path="ranking-geral" element={<RankingGeral />} />
          <Route path="ranking-por-times" element={<RankingPorTimes />} />
          <Route path="calculo-xp" element={<PersonalMetrics username={username} />} />
          <Route path="loja-de-troca" element={<LojaDeTroca />} /> {/* Add the new route */}
        </Route>
      </Routes>
    </div>
  );
};

export default AppContainer;