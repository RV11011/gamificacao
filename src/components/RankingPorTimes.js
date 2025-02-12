import React from 'react';
import './RankingPorTimes.css';

const RankingPorTimes = () => {
  const rankings = [
    { rank: 1, name: 'John', team: 'Team A', xp: 500 },
    { rank: 2, name: 'Alice', team: 'Team B', xp: 450 },
    { rank: 3, name: 'Bob', team: 'Team C', xp: 400 },
    { rank: 4, name: 'Charlie', team: 'Team D', xp: 350 },
    { rank: 5, name: 'David', team: 'Team A', xp: 300 },
  ];

  return (
    <div className="ranking-container">
      <h2>Ranking por Times</h2>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Nome</th>
            <th>Time</th>
            <th>XP</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((user) => (
            <tr key={user.rank} className={user.rank === 1 ? 'top-rank' : ''}>
              <td>
                {user.rank === 1 ? <span className="star-icon">★</span> : ''}{' '}
                {user.rank}
              </td>
              <td>{user.name}</td>
              <td>{user.team}</td>
              <td>{user.xp} XP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingPorTimes;