import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = ({ username }) => {
  const [top3, setTop3] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop3 = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/ranking-colaboradores');
        const data = await response.json();
        setTop3(data.slice(0, 3));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTop3();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="home-container fade-in">
      <img src="/logo.png" alt="Logo Gamificação" className="main-logo pulse" />
      
      <div className="greeting">
        <h1 className="greeting-text">{getGreeting()}, {username}</h1>
        <p className="welcome-text">Bem vindo à Gamificação</p>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="ranking-section">
          <div className="ranking-header">
            <div className="ranking-title">
              <i className="fas fa-chart-line"></i>
              <h2>Ranking do Momento</h2>
              <span className="update-badge">Tempo Real</span>
            </div>
          </div>
          
          <div className="podium-container">
            {/* 2º Lugar */}
            <div className="podium-place place-2">
              <div className="medal silver">
                <i className="fas fa-medal"></i>
              </div>
              <div className="glass-card">
                <img src={`/images/${top3[1]?.Atendente}.jpg`} alt={top3[1]?.Atendente} className="podium-photo" />
                <div className="podium-info">
                  <h2>{top3[1]?.Atendente}</h2>
                  <p className="department">{top3[1]?.Departamento}</p>
                  <p className="xp">{top3[1]?.Total} XP</p>
                </div>
              </div>
            </div>

            {/* 1º Lugar */}
            <div className="podium-place place-1">
              <div className="crown-container">
                <div className="crown">
                  <i className="fas fa-crown"></i>
                </div>
              </div>
              <div className="glass-card highlight">
                <img src={`/images/${top3[0]?.Atendente}.jpg`} alt={top3[0]?.Atendente} className="podium-photo" />
                <div className="podium-info">
                  <h2>{top3[0]?.Atendente}</h2>
                  <p className="department">{top3[0]?.Departamento}</p>
                  <p className="xp">{top3[0]?.Total} XP</p>
                </div>
              </div>
            </div>

            {/* 3º Lugar */}
            <div className="podium-place place-3">
              <div className="medal bronze">
                <i className="fas fa-medal"></i>
              </div>
              <div className="glass-card">
                <img src={`/images/${top3[2]?.Atendente}.jpg`} alt={top3[2]?.Atendente} className="podium-photo" />
                <div className="podium-info">
                  <h2>{top3[2]?.Atendente}</h2>
                  <p className="department">{top3[2]?.Departamento}</p>
                  <p className="xp">{top3[2]?.Total} XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;