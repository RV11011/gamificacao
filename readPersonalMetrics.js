const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const METRICS_HEADERS = [
  'Data',
  'Combinação',
  'Departamento',
  'Atendente',
  'Função',
  'Atendimentos',
  'TMF',
  'TMA',
  'Implantações',
  'Erros de Documentação',
  'SLA no Prazo',
  'Média Score',
  'Taxa de Avaliação',
  'Notas Justas',
  'Problemas Comportamentais',
  'Problemas Técnicos',
  'Cartões de Falha',
  'Cartões de Melhoria',
  'Cartões de Tarefa',
  'Inconsistências no Ponto',
  'Treinamento participado',
  'Treinamento realizado',
  'PDIs'
];

const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null,
};

// Cache para armazenar os dados
const cache = {
  data: null,
  timestamp: null,
  ttl: 60 * 1000 // 1 minuto
};

// Função para converter HH:MM:SS para minutos
function convertTimeToMinutes(time) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return (hours * 60) + minutes + (seconds / 60);
}

async function getPersonalMetrics(atendente, date = '01') {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Cálculo de Indicadores'];
    if (!sheet) throw new Error('Aba não encontrada');

    const rows = await sheet.getRows();
    const data = rows.map(row => {
      const metrics = {};
      METRICS_HEADERS.forEach((header, colIndex) => {
        metrics[header] = row._rawData[colIndex] || '0';
      });
      return metrics;
    });

    console.log(`Buscando métricas para ${atendente} no mês ${date}`);

    // Filtrar por data e atendente
    const metricsForDate = data.find(row => {
      const expectedDate = `01/${date}/2025`;
      const rowDate = row.Data;
      return rowDate === expectedDate && row.Atendente === atendente;
    });

    if (!metricsForDate) {
      console.log('Nenhuma métrica encontrada para:', atendente, 'na data:', `01/${date}/2025`);
      return null;
    }

    // Converter TMF para minutos
    metricsForDate.TMF = convertTimeToMinutes(metricsForDate.TMF);

    console.log('Métricas encontradas:', metricsForDate);
    return metricsForDate;

  } catch (error) {
    console.error('Erro ao ler métricas pessoais:', error);
    throw error;
  }
}

module.exports = {
  getPersonalMetrics,
  setupPersonalMetricsRoutes: (app) => {
    app.get('/api/personal-metrics/:atendente', async (req, res) => {
      try {
        const { date } = req.query;
        const metrics = await getPersonalMetrics(req.params.atendente, date);
        if (metrics) {
          res.json({
            atendente: metrics.Atendente,
            funcao: metrics.Função,
            metricas: {
              atendimentos: {
                total: parseInt(metrics.Atendimentos),
                tmf: metrics.TMF, // Já convertido para minutos
                tma: parseFloat(metrics.TMA)
              },
              implantacoes: parseInt(metrics.Implantações),
              qualidade: {
                errosDocumentacao: parseInt(metrics['Erros de Documentação']),
                sla: parseFloat(metrics['SLA no Prazo']),
                mediaScore: parseFloat(metrics['Média Score']),
                taxaAvaliacao: parseFloat(metrics['Taxa de Avaliação']),
                notasJustas: parseInt(metrics['Notas Justas'])
              },
              problemas: {
                comportamentais: parseInt(metrics['Problemas Comportamentais']),
                tecnicos: parseInt(metrics['Problemas Técnicos'])
              },
              desenvolvimento: {
                treinamentosParticipados: parseInt(metrics['Treinamento participado']),
                treinamentosRealizados: parseInt(metrics['Treinamento realizado']),
                pdis: parseInt(metrics.PDIs)
              },
              cartoes: {
                falha: parseInt(metrics['Cartões de Falha']),
                melhoria: parseInt(metrics['Cartões de Melhoria']),
                tarefa: parseInt(metrics['Cartões de Tarefa'])
              },
              inconsistenciasNoPonto: parseInt(metrics['Inconsistências no Ponto']),
              data: metrics.Data,
              departamento: metrics.Departamento,
              funcao: metrics.Função
            }
          });
        } else {
          res.status(404).json({ error: 'Colaborador não encontrado' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar métricas pessoais' });
      }
    });
  }
};