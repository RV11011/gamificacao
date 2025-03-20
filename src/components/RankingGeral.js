import React, { useEffect, useState } from 'react';
import './RankingGeral.css';

const RankingGeral = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/ranking-colaboradores');
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

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
              <td>{user.Atendente}</td>
              <td>{user.Total} XP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RankingGeral;