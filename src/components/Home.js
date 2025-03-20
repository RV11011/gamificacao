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
    
    if (hour >= 5 && hour < 12) {
      return "Bom dia";
    } else if (hour >= 12 && hour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };

  return (
    <div className="home-container">
      <div className="greeting">
        <h1>{getGreeting()}, {username}</h1>
        <p>Bem vindo a Gamificação</p>
      </div>
      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="podium">
          {top3.map((user, index) => (
            <div key={index} className={`podium-place place-${index + 1}`}>
              <img src={`/images/${user.Atendente}.jpg`} alt={user.Atendente} className="podium-photo" loading="lazy" />
              <div className="podium-info">
                <h2>{user.Atendente}</h2>
                <p>{user.Total} XP</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;