const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');

// Carregue as credenciais do arquivo JSON
const credentialsPath = path.join(__dirname, 'service-account.json');
if (!fs.existsSync(credentialsPath)) {
  console.error('Arquivo service-account.json não encontrado.');
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath));
console.log('Credenciais carregadas:', credentials);

// ID da planilha do Google Sheets
const SPREADSHEET_ID = '1n01Pj7vZftKbmGW4SoLhankSl1Rqua7zwqqscPhN4ow';

// Nome da aba que você deseja ler
const SHEET_TITLE = 'Cálculo de XP'; // Substitua pelo nome da aba que você deseja ler

// Função para ler dados da planilha
async function readSheet() {
  try {
    console.log('Iniciando leitura da planilha...');
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    // Autenticar com o serviço de contas
    await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    });
    console.log('Autenticação bem-sucedida.');

    // Carregar a planilha
    await doc.loadInfo();
    console.log(`Título da planilha: ${doc.title}`);

    // Selecionar a aba desejada
    const sheet = doc.sheetsByTitle[SHEET_TITLE];
    if (!sheet) {
      console.error(`Aba "${SHEET_TITLE}" não encontrada.`);
      return;
    }

    // Carregar as linhas da aba
    const rows = await sheet.getRows();
    console.log('Dados da planilha:');
    rows.forEach((row) => {
      console.log(row._rawData);
    });
  } catch (error) {
    console.error('Erro ao ler a planilha:', error);
  }
}

// Executar a função de leitura da planilha
readSheet().catch(console.error);