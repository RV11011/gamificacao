import React from 'react';
import './RankingGeral.css';

const RankingGeral = () => {
  const rankings = [
    { rank: 1, name: 'James', xp: 500 },
    { rank: 2, name: 'Emma', xp: 450 },
    { rank: 3, name: 'Liam', xp: 400 },
    { rank: 4, name: 'Olivia', xp: 350 },
    { rank: 5, name: 'Lucas', xp: 300 },
    { rank: 6, name: 'Sophia', xp: 250 },
    { rank: 7, name: 'Mason', xp: 200 },
    { rank: 8, name: 'Ava', xp: 150 },
    { rank: 9, name: 'Ethan', xp: 100 },
    { rank: 10, name: 'Isabella', xp: 50 },
  ];

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
          {rankings.map((user) => (
            <tr key={user.rank} className={user.rank === 1 ? 'top-rank' : ''}>
              <td>{user.rank === 1 ? <span className="star-icon">★</span> : ''} {user.rank}</td>
              <td>{user.name}</td>
              <td>{user.xp} XP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RankingGeral;