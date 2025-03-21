const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const METRICS_HEADERS = [
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
  'Problemas Críticos',
  'Treinamento participado',
  'Treinamento realizado',
  'Projetos/Desafios',
  'PDIs',
  'Cartões de Falha',
  'Cartões de Melhoria',
  'Cartões de Tarefa',
  'Ajuste do GM',
  'Total'
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

async function getPersonalMetrics(atendente) {
  try {
    // Verificar cache
    const now = Date.now();
    if (cache.data && (now - cache.timestamp < cache.ttl)) {
      return cache.data.find(user => user.Atendente === atendente);
    }

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Cálculo de XP'];
    if (!sheet) throw new Error('Aba não encontrada');

    const rows = await sheet.getRows();
    const data = rows.map(row => {
      const metrics = {};
      METRICS_HEADERS.forEach((header, colIndex) => {
        metrics[header] = row._rawData[colIndex] || '0';
      });
      return metrics;
    });

    // Atualizar cache
    cache.data = data;
    cache.timestamp = now;

    // Encontrar dados do usuário específico
    return data.find(user => user.Atendente === atendente);
  } catch (error) {
    console.error('Erro ao ler métricas pessoais:', error);
    throw error;
  }
}

// Adicionar ao servidor Express
module.exports = {
  getPersonalMetrics,
  // Exemplo de uso na rota:
  setupPersonalMetricsRoutes: (app) => {
    app.get('/api/personal-metrics/:atendente', async (req, res) => {
      try {
        const metrics = await getPersonalMetrics(req.params.atendente);
        if (metrics) {
          res.json({
            atendente: metrics.Atendente,
            funcao: metrics.Função,
            metricas: {
              atendimentos: {
                total: parseInt(metrics.Atendimentos),
                tmf: parseInt(metrics.TMF),
                tma: parseInt(metrics.TMA)
              },
              implantacoes: parseInt(metrics.Implantações),
              qualidade: {
                errosDocumentacao: parseInt(metrics['Erros de Documentação']),
                sla: parseInt(metrics['SLA no Prazo']),
                mediaScore: parseInt(metrics['Média Score']),
                taxaAvaliacao: parseInt(metrics['Taxa de Avaliação']),
                notasJustas: parseInt(metrics['Notas Justas'])
              },
              problemas: {
                comportamentais: parseInt(metrics['Problemas Comportamentais']),
                tecnicos: parseInt(metrics['Problemas Técnicos']),
                criticos: parseInt(metrics['Problemas Críticos'])
              },
              desenvolvimento: {
                treinamentosParticipados: parseInt(metrics['Treinamento participado']),
                treinamentosRealizados: parseInt(metrics['Treinamento realizado']),
                projetos: parseInt(metrics['Projetos/Desafios']),
                pdis: parseInt(metrics.PDIs)
              },
              cartoes: {
                falha: parseInt(metrics['Cartões de Falha']),
                melhoria: parseInt(metrics['Cartões de Melhoria']),
                tarefa: parseInt(metrics['Cartões de Tarefa'])
              },
              ajusteGM: parseInt(metrics['Ajuste do GM']) || 0,
              totalXP: parseInt(metrics.Total)
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