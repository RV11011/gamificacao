import React, { useEffect, useState } from 'react';
import './RankingPorTimes.css';

const RankingPorTimes = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/ranking-times');
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
              <td>{index + 1}</td>
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