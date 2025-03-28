import React, { useEffect, useState } from 'react';
import './RankingPorTimes.css';
import API_BASE_URL from '../config';

const RankingPorTimes = () => {
  const [rankings, setRankings] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ranking-times`);
        const data = await response.json();
        setRankings(data);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar o ranking de times');
      }
    };

    fetchData();
  }, []);

  const handleTeamClick = async (department) => {
    try {
      setError(null);
      console.log('Clicou no departamento:', department);

      // Tratamento especial para departamentos específicos
      let safeUrl = department;
      
      if (department.includes('/')) {
        safeUrl = department.replace('/', '--');
      } else if (department === 'Instalação') {
        safeUrl = 'Instalacao';
      }

      console.log('URL formatada:', `${API_BASE_URL}/api/team-members/${encodeURIComponent(safeUrl)}`);
      
      const response = await fetch(`${API_BASE_URL}/api/team-members/${encodeURIComponent(safeUrl)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar membros do time');
      }

      setTeamMembers(data);
      setSelectedTeam(department);
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao buscar membros do time:', error);
      setError(`Erro ao buscar membros do time ${department}`);
      setShowModal(true);
    }
  };

  const Modal = ({ onClose, team, members }) => {
    console.log('Modal props:', { team, members, showModal });
    
    if (!showModal) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Time: {team}</h3>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            {error ? (
              <div className="error-message">{error}</div>
            ) : members.length === 0 ? (
              <div className="empty-message">Nenhum membro encontrado para este time.</div>
            ) : (
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Função</th>
                    <th>XP Individual</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={index}>
                      <td>{member.full_name}</td>
                      <td>{member.role}</td>
                      <td>{member.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

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
              <td>
                <button 
                  className="team-name-button" 
                  onClick={() => handleTeamClick(team.department)}
                >
                  {team.department}
                </button>
              </td>
              <td>{team.xp} XP</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal 
        onClose={() => setShowModal(false)}
        team={selectedTeam}
        members={teamMembers}
      />
    </div>
  );
};

export default RankingPorTimes;