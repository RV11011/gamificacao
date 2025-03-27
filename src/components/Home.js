import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = ({ username }) => {
  const [top3, setTop3] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Buscar dados do usuário logado
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://192.168.14.31:3001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, [username]);

  useEffect(() => {
    const fetchTop3 = async () => {
      try {
        const response = await fetch('http://192.168.14.31:3001/api/ranking-colaboradores'); // Atualize o endereço IP aqui
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

  const getPhotoPath = (name) => {
    try {
      return require(`../assets/images/${name}.jpg`);
    } catch {
      return '/default-avatar.jpg'; // Caminho para uma imagem padrão
    }
  };

  // Usar o nome completo do usuário se disponível, caso contrário usar o username
  const displayName = userData?.full_name || username;

  return (
    <div className="home-container fade-in">
      <img src="/logo.png" alt="Logo Gamificação" className="main-logo pulse" />
      
      <div className="greeting">
        <h1 className="greeting-text">{getGreeting()}, {displayName}</h1>
        <p className="welcome-text">Bem vindo à Gamificação</p>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="ranking-section">
          <div className="ranking-header">
            <div className="">
              <h2>Ranking do Momento</h2>
            </div>
          </div>
          
          <div className="podium-container">
            {/* 2º Lugar */}
            <div className="podium-place place-2">
              <div className="medal silver">
                <i className="fas fa-medal"></i>
              </div>
              <div className="glass-card">
                <img src={getPhotoPath(top3[1]?.Atendente)} alt={top3[1]?.Atendente} className="podium-photo" />
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
                <img src={getPhotoPath(top3[0]?.Atendente)} alt={top3[0]?.Atendente} className="podium-photo" />
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
                <img src={getPhotoPath(top3[2]?.Atendente)} alt={top3[2]?.Atendente} className="podium-photo" />
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

const QuickStats = () => {
  return (
    <div className="quick-stats">
      <div className="stat-card">
        <i className="fas fa-chart-line"></i>
        <div className="stat-info">
          <h3>Posição no Ranking</h3>
          <p>#12</p>
        </div>
      </div>
      <div className="stat-card">
        <i className="fas fa-trophy"></i>
        <div className="stat-info">
          <h3>XP Total</h3>
          <p>1,234</p>
        </div>
      </div>
      <div className="stat-card">
        <i className="fas fa-medal"></i>
        <div className="stat-info">
          <h3>Insígnias</h3>
          <p>5/12</p>
        </div>
      </div>
    </div>
  );
};

export default Home;