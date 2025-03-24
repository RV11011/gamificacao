require('dotenv').config();
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { getPersonalMetrics } = require('./readPersonalMetrics'); // Adicione esta linha
const readSheet = require('./readSheet'); // Adicione esta linha

const app = express();
const port = 3001; // Porta para o servidor backend

app.use(cors()); // Permitir requisições CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  user: 'gamificacao_user',
  password: 'gamificacao_password',
  host: 'localhost',
  database: 'gamificacao_db',
  port: 5432
});

// Usuários predefinidos
const users = [
  { username: process.env.USER1_USERNAME, password: process.env.USER1_PASSWORD },
  { username: process.env.USER2_USERNAME, password: process.env.USER2_PASSWORD },
  { username: process.env.USER3_USERNAME, password: process.env.USER3_PASSWORD }
];

// Modificar a rota de login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT id, username, password, full_name, department, role FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      // Atualizar último login
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Remover senha antes de enviar
      delete user.password;
      res.json(user);
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar a rota de métricas pessoais
app.get('/api/personal-metrics/:atendente', async (req, res) => {
  try {
    const { date } = req.query;
    console.log('Buscando métricas para:', req.params.atendente, 'data:', date);
    
    const metrics = await getPersonalMetrics(req.params.atendente, date);
    if (metrics) {
      // Log dos valores brutos
      console.log('Valores brutos do TMF:', {
        tmf_original: metrics.TMF,
        tmf_parsed: parseFloat(metrics.TMF)
      });

      res.json({
        atendente: metrics.Atendente,
        funcao: metrics.Função,
        data: metrics.Data,
        metricas: {
          atendimentos: {
            total: parseInt(metrics.Atendimentos) || 0,
            tmf: parseFloat(metrics.TMF) || 0,
            tma: parseFloat(metrics.TMA) || 0
          },
          implantacoes: parseInt(metrics.Implantações) || 0,
          qualidade: {
            errosDocumentacao: parseInt(metrics['Erros de Documentação']) || 0,
            sla: parseFloat(metrics['SLA no Prazo']) || 0,
            mediaScore: parseFloat(metrics['Média Score']) || 0,
            taxaAvaliacao: parseFloat(metrics['Taxa de Avaliação']) || 0,
            notasJustas: parseInt(metrics['Notas Justas']) || 0
          },
          problemas: {
            comportamentais: parseInt(metrics['Problemas Comportamentais']) || 0,
            tecnicos: parseInt(metrics['Problemas Técnicos']) || 0
          },
          desenvolvimento: {
            treinamentosParticipados: parseInt(metrics['Treinamento participado']) || 0,
            treinamentosRealizados: parseInt(metrics['Treinamento realizado']) || 0,
            pdis: parseInt(metrics.PDIs) || 0
          },
          cartoes: {
            falha: parseInt(metrics['Cartões de Falha']) || 0,
            melhoria: parseInt(metrics['Cartões de Melhoria']) || 0,
            tarefa: parseInt(metrics['Cartões de Tarefa']) || 0
          },
          inconsistenciasNoPonto: parseInt(metrics['Inconsistências no Ponto']) || 0
        }
      });
      
      // Log do objeto final
      console.log('Objeto enviado para o frontend:', {
        tmf_final: parseFloat(metrics.TMF) || 0
      });
    } else {
      res.status(404).json({ 
        error: 'Colaborador não encontrado para o período selecionado',
        details: {
          atendente: req.params.atendente,
          date: date
        }
      });
    }
  } catch (error) {
    console.error('Erro ao buscar métricas pessoais:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas pessoais' });
  }
});

app.get('/api/ranking-colaboradores', async (req, res) => {
  try {
    const data = await readSheet();
    const sortedData = Object.values(data).sort((a, b) => b.Total - a.Total);
    res.json(sortedData);
  } catch (error) {
    console.error('Erro ao buscar dados da planilha:', error);
    res.status(500).send('Erro ao buscar dados da planilha');
  }
});

app.get('/api/ranking-times', async (req, res) => {
  try {
    const data = await readSheet();
    const departmentXP = Object.values(data).reduce((acc, row) => {
      const department = row.Departamento;
      const xp = parseInt(row.Total, 10) || 0;
      if (!acc[department]) {
        acc[department] = 0;
      }
      acc[department] += xp;
      return acc;
    }, {});

    const sortedRankings = Object.entries(departmentXP)
      .map(([department, xp]) => ({ department, xp }))
      .sort((a, b) => b.xp - a.xp);

    res.json(sortedRankings);
  } catch (error) {
    console.error('Erro ao buscar dados da planilha:', error);
    res.status(500).send('Erro ao buscar dados da planilha');
  }
});

// Carregar certificados SSL
const privateKeyPath = 'path/to/your/private.key';
const certificatePath = 'path/to/your/certificate.crt';
const caPath = 'path/to/your/ca_bundle.crt';

if (fs.existsSync(privateKeyPath) && fs.existsSync(certificatePath) && fs.existsSync(caPath)) {
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const certificate = fs.readFileSync(certificatePath, 'utf8');
  const ca = fs.readFileSync(caPath, 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(port, () => {
    console.log(`Servidor backend rodando em https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
  });
}