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
const readSheet = require('./readSheet');
const { getPersonalMetrics } = require('./readPersonalMetrics');
const os = require('os');

const app = express();
const port = 3001;

console.log('Iniciando servidor...');
console.log('Interfaces de rede disponíveis:');
Object.values(os.networkInterfaces()).forEach(interfaces => {
  interfaces.forEach(networkInterface => {
    if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
      console.log(`- ${networkInterface.address}`);
    }
  });
});

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.27.83:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  user: 'gamificacao_user',
  password: 'gamificacao_password',
  host: 'localhost',
  database: 'gamificacao_db',
  port: 5432
});

// Teste de conexão com o banco
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    release();
  }
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API está funcionando!' });
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

// Atualizar a rota de métricas pessoais para usar getPersonalMetrics
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
            tmf: metrics.TMF,
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
    console.error('Erro ao buscar métricas pessoais:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas pessoais' });
  }
});

// Manter as rotas de ranking usando readSheet
app.get('/api/ranking-colaboradores', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await readSheet();
    const sortedData = Object.values(data).sort((a, b) => b.Total - a.Total);

    // Paginação
    const startIndex = (page - 1) * limit;
    const paginatedData = sortedData.slice(startIndex, startIndex + limit);

    res.json(paginatedData);
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

// Rota para buscar membros de um time específico
app.get('/api/team-members/:department', async (req, res) => {
  try {
    const { department } = req.params;
    console.log('Recebida requisição para departamento:', department);

    // Decodificar o departamento e restaurar caracteres especiais
    let decodedDepartment = decodeURIComponent(department)
      .replace('--', '/');

    // Tratamento especial para casos específicos
    const departmentMap = {
      'Instalacao': 'Instalação',
      'instalacao': 'Instalação',
      'ACS': 'ACS',
      '12/36': '12/36'
    };

    if (departmentMap[decodedDepartment]) {
      decodedDepartment = departmentMap[decodedDepartment];
    }

    console.log('Departamento decodificado:', decodedDepartment);

    // Buscar dados da planilha primeiro
    const sheetData = await readSheet();
    
    // Filtrar membros do departamento diretamente da planilha
    const teamMembers = Object.values(sheetData)
      .filter(data => {
        const normalizeString = str => str?.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        
        return normalizeString(data.Departamento) === normalizeString(decodedDepartment);
      })
      .map(data => ({
        full_name: data.Atendente,
        role: 'Colaborador', // Valor padrão, já que não temos essa info na planilha
        xp: parseInt(data.Total) || 0
      }));

    // Se não encontrar membros, retornar array vazio
    if (teamMembers.length === 0) {
      console.log('Nenhum membro encontrado para o departamento:', decodedDepartment);
      return res.json([]);
    }

    // Ordenar por XP (maior para menor)
    teamMembers.sort((a, b) => b.xp - a.xp);

    console.log(`Retornando ${teamMembers.length} membros do time ${decodedDepartment}`);
    res.json(teamMembers);

  } catch (error) {
    console.error('Erro ao buscar membros do time:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar membros do time',
      details: error.message,
      department: req.params.department
    });
  }
});

// Rota para obter interfaces de rede
app.get('/api/network-interfaces', (req, res) => {
  const interfaces = [];
  Object.values(os.networkInterfaces()).forEach(networkInterfaces => {
    networkInterfaces.forEach(networkInterface => {
      if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
        interfaces.push(networkInterface.address);
      }
    });
  });
  res.json(interfaces);
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
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor backend rodando em http://0.0.0.0:${port}`);
    console.log('Endereços disponíveis:');
    Object.values(os.networkInterfaces()).forEach(interfaces => {
      interfaces.forEach(networkInterface => {
        if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
          console.log(`- ${networkInterface.address}`);
        }
      });
    });
  });

  // Tratamento de erros do servidor
  server.on('error', (error) => {
    console.error('Erro no servidor:', error);
  });
}