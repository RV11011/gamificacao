import React, { useEffect, useState } from 'react';
import './PersonalMetrics.css';

const PersonalMetrics = ({ username }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Usar o nome completo do atendente armazenado no localStorage
        const fullName = localStorage.getItem('fullName');
        if (!fullName) throw new Error('Nome completo não encontrado');

        const metricsResponse = await fetch(`http://192.168.14.31:3001/api/personal-metrics/${encodeURIComponent(fullName)}`);
        if (!metricsResponse.ok) throw new Error('Erro ao buscar métricas');
        
        const data = await metricsResponse.json();
        setMetrics(data);
      } catch (error) {
        console.error('Erro:', error);
        setError('Erro ao carregar métricas pessoais');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!metrics) return <div className="no-metrics">Nenhuma métrica encontrada</div>;

  return (
    <div className="personal-metrics">
      <h2>Cálculo de XP</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Atendimentos</h3>
          <p>Total: {metrics.metricas.atendimentos.total} XP</p>
          <p>TMF: {metrics.metricas.atendimentos.tmf} XP</p>
          <p>TMA: {metrics.metricas.atendimentos.tma} XP</p>
        </div>
        
        <div className="metric-card">
          <h3>Qualidade</h3>
          <p>Média Score: {metrics.metricas.qualidade.mediaScore} XP</p>
          <p>SLA: {metrics.metricas.qualidade.sla} XP</p>
          <p>Erros de Documentação: {metrics.metricas.qualidade.errosDocumentacao} XP</p>
        </div>

        <div className="metric-card">
          <h3>Desenvolvimento</h3>
          <p>Treinamentos Participados: {metrics.metricas.desenvolvimento.treinamentosParticipados} XP</p>
          <p>Treinamentos Realizados: {metrics.metricas.desenvolvimento.treinamentosRealizados} XP</p>
          <p>Projetos: {metrics.metricas.desenvolvimento.projetos} XP</p>
          <p>PDIs: {metrics.metricas.desenvolvimento.pdis} XP</p>
        </div>

        <div className="metric-card">
          <h3>Problemas</h3>
          <p>Comportamentais: {metrics.metricas.problemas.comportamentais} XP</p>
          <p>Técnicos: {metrics.metricas.problemas.tecnicos} XP</p>
          <p>Críticos: {metrics.metricas.problemas.criticos} XP</p>
        </div>

        <div className="metric-card">
          <h3>Cartões</h3>
          <p>Falha: {metrics.metricas.cartoes.falha} XP</p>
          <p>Melhoria: {metrics.metricas.cartoes.melhoria} XP</p>
          <p>Tarefa: {metrics.metricas.cartoes.tarefa} XP</p>
        </div>

        <div className="metric-card">
          <h3>XP Total</h3>
          <p className="xp-total">{metrics.metricas.totalXP} XP</p>
          <p>Ajuste GM: {metrics.metricas.ajusteGM} XP</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalMetrics;