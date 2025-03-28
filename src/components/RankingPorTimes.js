import React, { useEffect, useState } from 'react';
import './RankingPorTimes.css';
import API_BASE_URL from '../config';

const RankingPorTimes = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ranking-times`);
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
      <h2>Ranking por Times</h2>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Departamento</th>
            <th>XP Total</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((team, index) => (
            <tr key={team.department} className={index === 0 ? 'top-rank' : ''}>
              <td>
                {index === 0 && <i className="fas fa-crown star-icon"></i>}
                {index === 1 && <i className="fas fa-medal star-icon" style={{ color: '#C0C0C0' }}></i>}
                {index === 2 && <i className="fas fa-medal star-icon" style={{ color: '#CD7F32' }}></i>}
                {index + 1}
              </td>
              <td>{team.department}</td>
              <td>{team.xp} XP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingPorTimes;