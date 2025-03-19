import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';
import RankingGeral from './RankingGeral';
import RankingPorTimes from './RankingPorTimes';
import './AppContainer.css';

const AppContainer = ({ username }) => {
  const location = useLocation();

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <div className="route-section">
          <Routes location={location}>
            <Route path="/" element={<Home username={username} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="ranking-geral" element={<RankingGeral />} />
              <Route path="ranking-por-times" element={<RankingPorTimes />} />
            </Route>
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default AppContainer;