const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 1. Carregar credenciais
const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null,
};

// Verificar se as credenciais estão definidas
if (!credentials.client_email || !credentials.private_key) {
  console.error('Credenciais do Google não definidas. Verifique o arquivo .env.');
  process.exit(1);
}

// 2. Mapeamento completo das colunas (NA ORDEM EXATA DA PLANILHA)
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

async function readSheet() {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    // 3. Autenticar
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    // 4. Carregar a aba correta
    const sheet = doc.sheetsByTitle['Cálculo de XP'];
    if (!sheet) throw new Error('Aba não encontrada');

    // 5. Ler todas as linhas brutas
    const rows = await sheet.getRows();

    // 6. Processar cada linha com o mapeamento correto
    console.log('\n=== DADOS COMPLETOS DA PLANILHA ===');
    rows.forEach((row, index) => {
      const registro = {};
      CUSTOM_HEADERS.forEach((header, colIndex) => {
        registro[header] = row._rawData[colIndex] || 'N/D';
      });
      
      console.log(`\nRegistro #${index + 1}:`);
      console.log('Atendente:', registro.Atendente);
      console.log('Detalhes:', {
        Data: registro.Data,
        Departamento: registro.Departamento,
        Total: registro.Total
      });
    });

  } catch (error) {
    console.error('Erro ao ler a planilha:', error.message);
  }
}

readSheet();