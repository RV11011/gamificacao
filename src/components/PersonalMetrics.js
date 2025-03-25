import React, { useEffect, useState } from 'react';
import './PersonalMetrics.css';

const PersonalMetrics = ({ username }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('01'); // Mês padrão (Janeiro)

  // Função para obter o nome do mês referente
  const getReferenceMonth = (date) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
      'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 
      'Novembro', 'Dezembro'
    ];
    return months[parseInt(date) - 1];
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const fullName = localStorage.getItem('fullName');
        if (!fullName) throw new Error('Nome completo não encontrado');

        const metricsResponse = await fetch(
          `http://192.168.14.31:3001/api/personal-metrics/${encodeURIComponent(fullName)}?date=${selectedDate}`
        );
        
        if (!metricsResponse.ok) throw new Error('Erro ao buscar métricas');
        
        const data = await metricsResponse.json();
        
        // Log do valor recebido
        console.log('TMF recebido do backend:', data.metricas.atendimentos.tmf);
        
        setMetrics(data);
      } catch (error) {
        console.error('Erro:', error);
        setError('Erro ao carregar métricas pessoais');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedDate]); // Adicionar selectedDate como dependência

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!metrics) return <div className="no-metrics">Nenhuma métrica encontrada</div>;

  return (
    <div className="personal-metrics">
      <div className="metrics-header">
        <h2>Métricas Pessoais</h2>
        <div className="date-filter">
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-select"
          >
            <option value="01">Janeiro</option>
            <option value="02">Fevereiro</option>
            <option value="03">Março</option>
          </select>
          <p className="reference-period">
            Período de Referência: {getReferenceMonth(selectedDate)} de 2025
          </p>
        </div>
      </div>
      
      {/* Resto do código dos cards de métricas */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Atendimentos e SLAs</h3>
          <p>Total de Atendimentos: {metrics.metricas.atendimentos.total}</p>
          <p>TMF: {metrics.metricas.atendimentos.tmf.toFixed(2)} minutos</p> {/* Certifique-se de usar toFixed(2) */}
          <p>TMA: {metrics.metricas.atendimentos.tma.toFixed(2)} horas</p>
          <p>Implantações: {metrics.metricas.implantacoes}</p>
        </div>
        
        <div className="metric-card">
          <h3>Indicadores de Qualidade</h3>
          <p>Erros de Documentação: {metrics.metricas.qualidade.errosDocumentacao}</p>
          <p>SLA no Prazo: {metrics.metricas.qualidade.sla.toFixed(2)}%</p>
          <p>Média Score: {metrics.metricas.qualidade.mediaScore.toFixed(2)}</p>
          <p>Taxa de Avaliação: {metrics.metricas.qualidade.taxaAvaliacao.toFixed(2)}%</p>
          <p>Notas Justas: {metrics.metricas.qualidade.notasJustas}</p>
        </div>

        <div className="metric-card">
          <h3>Desenvolvimento</h3>
          <p>Treinamentos Participados: {metrics.metricas.desenvolvimento.treinamentosParticipados}</p>
          <p>Treinamentos Realizados: {metrics.metricas.desenvolvimento.treinamentosRealizados}</p>
          <p>PDIs: {metrics.metricas.desenvolvimento.pdis}</p>
        </div>

        <div className="metric-card">
          <h3>Problemas</h3>
          <p>Comportamentais: {metrics.metricas.problemas.comportamentais}</p>
          <p>Técnicos: {metrics.metricas.problemas.tecnicos}</p>
          <p>Inconsistências no Ponto: {metrics.metricas.problemas.inconsistenciasNoPonto}</p>
        </div>

        <div className="metric-card">
          <h3>Cartões</h3>
          <p>Falha: {metrics.metricas.cartoes.falha}</p>
          <p>Melhoria: {metrics.metricas.cartoes.melhoria}</p>
          <p>Tarefa: {metrics.metricas.cartoes.tarefa}</p>
        </div>

        <div className="metric-card">
          <h3>Informações Gerais</h3>
          <p>Departamento: {metrics.metricas.departamento}</p>
          <p>Função: {metrics.metricas.funcao}</p>
          <p>Data: {metrics.metricas.data}</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalMetrics;