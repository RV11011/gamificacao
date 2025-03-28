import React, { useEffect, useState } from 'react';
import './RankingGeral.css';
import API_BASE_URL from '../config';

const RankingGeral = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ranking-colaboradores`);
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const getPhotoPath = (name) => {
    try {
      return require(`../assets/images/${name}.jpg`);
    } catch {
      return '/default-avatar.jpg'; // Caminho para uma imagem padrão
    }
  };

  return (
    <div className="ranking-container">
      <h2>Ranking Geral</h2>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Nome</th>
            <th>XP</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((user, index) => (
            <tr key={index} className={index === 0 ? 'top-rank' : ''}>
              <td>
                {index === 0 && <i className="fas fa-crown star-icon"></i>}
                {index === 1 && <i className="fas fa-medal star-icon" style={{ color: '#C0C0C0' }}></i>}
                {index === 2 && <i className="fas fa-medal star-icon" style={{ color: '#CD7F32' }}></i>}
                {index + 1}
              </td>
              <td>
                <img
                  src={getPhotoPath(user.Atendente)}
                  alt={user.Atendente}
                  className="ranking-photo"
                />
                {user.Atendente}
              </td>
              <td>{user.Total} XP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingGeral;