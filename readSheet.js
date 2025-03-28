const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const cache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutos
};

async function readSheet() {
  try {
    // Verificar se os dados estão no cache e ainda válidos
    if (cache.data && Date.now() - cache.timestamp < cache.ttl) {
      console.log('Retornando dados do cache');
      return cache.data;
    }

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    // Tratamento correto da chave privada
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey
    });

    console.log('Conectando à planilha...');
    await doc.loadInfo();
    console.log('Planilha carregada:', doc.title);

    const sheet = doc.sheetsByTitle['Cálculo de XP'];
    if (!sheet) {
      console.error('Abas disponíveis:', doc.sheetsByTitle.map(s => s.title));
      throw new Error('Aba "Cálculo de XP" não encontrada');
    }

    console.log('Lendo dados da aba:', sheet.title);
    const rows = await sheet.getRows();
    console.log(`Encontradas ${rows.length} linhas`);

    const data = {};
    rows.forEach((row) => {
      const atendente = row.Atendente;
      if (!data[atendente]) {
        data[atendente] = {
          Atendente: atendente,
          Departamento: row.Departamento,
          Total: parseInt(row.Total) || 0,
        };
      } else {
        data[atendente].Total += parseInt(row.Total) || 0;
      }
    });

    // Armazenar os dados no cache
    cache.data = data;
    cache.timestamp = Date.now();

    console.log('Dados carregados com sucesso');
    return data;
  } catch (error) {
    console.error('Erro ao ler a planilha:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

module.exports = readSheet;