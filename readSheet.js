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
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Cálculo de XP'];
    if (!sheet) throw new Error('Aba não encontrada');

    const rows = await sheet.getRows();
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

    console.log('Dados carregados da planilha');
    return data;
  } catch (error) {
    console.error('Erro ao ler a planilha:', error.message);
    throw error;
  }
}

module.exports = readSheet;