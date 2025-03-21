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

// Carregar credenciais
const googleCredentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

const CUSTOM_HEADERS = [
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

const cache = {
  data: null,
  timestamp: null,
  ttl: 60 * 1000 // Tempo de vida do cache em milissegundos (1 minuto)
};

async function getSheetData() {
  const now = Date.now();
  if (cache.data && (now - cache.timestamp < cache.ttl)) {
    return cache.data;
  }

  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(googleCredentials);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Cálculo de XP'];
    if (!sheet) throw new Error('Aba não encontrada');

    const rows = await sheet.getRows();
    const data = rows.map(row => {
      const registro = {};
      CUSTOM_HEADERS.forEach((header, colIndex) => {
        registro[header] = row._rawData[colIndex] || 'N/D';
      });
      return registro;
    });

    cache.data = data;
    cache.timestamp = now;
    return data;
  } catch (error) {
    console.error('Erro ao obter dados da planilha:', error.message);
    throw error;
  }
}

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

// Nova rota para obter métricas pessoais
app.get('/api/metrics/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const data = await getSheetData();
    const userMetrics = data.find(row => row.Atendente === req.query.username);
    
    if (userMetrics) {
      res.json({
        xp: userMetrics.Total,
        department: userMetrics.Departamento,
        metrics: {
          atendimentos: userMetrics.Atendimentos,
          implantacoes: userMetrics.Implantações,
          mediaScore: userMetrics['Média Score'],
          sla: userMetrics['SLA no Prazo']
        }
      });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar métricas' });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const data = await getSheetData();
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar dados da planilha:', error);
    res.status(500).send('Erro ao buscar dados da planilha');
  }
});

app.get('/api/ranking-colaboradores', async (req, res) => {
  try {
    const data = await getSheetData();
    const sortedData = data.sort((a, b) => parseInt(b.Total, 10) - parseInt(a.Total, 10));
    res.json(sortedData);
  } catch (error) {
    console.error('Erro ao buscar dados da planilha:', error);
    res.status(500).send('Erro ao buscar dados da planilha');
  }
});

app.get('/api/ranking-times', async (req, res) => {
  try {
    const data = await getSheetData();
    const departmentXP = data.reduce((acc, row) => {
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