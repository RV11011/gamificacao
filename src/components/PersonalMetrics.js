import React, { useEffect, useState } from 'react';
import './PersonalMetrics.css';
import API_BASE_URL from '../config';

const PersonalMetrics = ({ username }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('01');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/personal-metrics/${username}?date=${selectedPeriod}`
        );
        if (!response.ok) throw new Error('Erro ao buscar métricas');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do colaborador:', error);
        setError('Erro ao carregar métricas pessoais');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, selectedPeriod]);

  const getPhotoPath = (name) => {
    try {
      return require(`../assets/images/${name}.jpg`);
    } catch {
      return '/default-avatar.jpg'; // Caminho para uma imagem padrão
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="personal-metrics">
      <div className="metrics-header">
        <img
          src={getPhotoPath(userData.atendente)}
          alt={userData.atendente}
          className="personal-photo"
        />
        <h2>Métricas Pessoais</h2>
        <p>Colaborador: {userData.atendente}</p>
        <div className="date-filter">
          <label htmlFor="date-select">Período de Referência:</label>
          <select
            id="date-select"
            className="date-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="01">Janeiro</option>
            <option value="02">Fevereiro</option>
            <option value="03">Março</option>
          </select>
        </div>
      </div>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Atendimentos e SLAs</h3>
          <p>Total de Atendimentos: {userData.metricas?.atendimentos?.total || 0}</p>
          <p>TMF: {userData.metricas?.atendimentos?.tmf?.toFixed(2) || '0.00'} minutos</p>
          <p>TMA: {userData.metricas?.atendimentos?.tma?.toFixed(2) || '0.00'} horas</p>
        </div>
        <div className="metric-card">
          <h3>Indicadores de Qualidade</h3>
          <p>Erros de Documentação: {userData.metricas?.qualidade?.errosDocumentacao || 0}</p>
          <p>SLA no Prazo: {userData.metricas?.qualidade?.sla?.toFixed(2) || '0.00'}%</p>
          <p>Média Score: {userData.metricas?.qualidade?.mediaScore?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="metric-card">
          <h3>Desenvolvimento</h3>
          <p>Treinamentos Participados: {userData.metricas?.desenvolvimento?.treinamentosParticipados || 0}</p>
          <p>PDIs: {userData.metricas?.desenvolvimento?.pdis || 0}</p>
        </div>
        <div className="metric-card">
          <h3>Cartões</h3>
          <p>Falha: {userData.metricas?.cartoes?.falha || 0}</p>
          <p>Melhoria: {userData.metricas?.cartoes?.melhoria || 0}</p>
          <p>Tarefa: {userData.metricas?.cartoes?.tarefa || 0}</p>
        </div>
        <div className="metric-card">
          <h3>Problemas</h3>
          <p>Comportamentais: {userData.metricas?.problemas?.comportamentais || 0}</p>
          <p>Técnicos: {userData.metricas?.problemas?.tecnicos || 0}</p>
          <p>Inconsistências no Ponto: {userData.metricas?.problemas?.inconsistencias || 0}</p>
        </div>
        <div className="metric-card">
          <h3>Informações Gerais</h3>
          <p>Departamento: {userData.funcao?.departamento || 'N/A'}</p>
          <p>Função: {userData.funcao?.funcao || 'N/A'}</p>
          <p>Data: {userData.funcao?.data || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalMetrics;