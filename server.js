const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001; // Porta para o servidor backend

app.use(cors()); // Permitir requisições CORS

// Carregar credenciais
const credentialsPath = path.join(__dirname, 'service-account.json');
if (!fs.existsSync(credentialsPath)) {
  console.error('Arquivo service-account.json não encontrado.');
  process.exit(1);
}
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

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

async function getSheetData() {
  const doc = new GoogleSpreadsheet('1n01Pj7vZftKbmGW4SoLhankSl1Rqua7zwqqscPhN4ow');
  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle['Cálculo de XP'];
  if (!sheet) throw new Error('Aba não encontrada');

  const rows = await sheet.getRows();
  return rows.map(row => {
    const registro = {};
    CUSTOM_HEADERS.forEach((header, colIndex) => {
      registro[header] = row._rawData[colIndex] || 'N/D';
    });
    return registro;
  });
}

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

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});