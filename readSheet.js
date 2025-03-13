const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');

// 1. Carregar credenciais
const credentialsPath = path.join(__dirname, 'service-account.json');
if (!fs.existsSync(credentialsPath)) {
  console.error('Arquivo service-account.json não encontrado.');
  process.exit(1);
}
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

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
    const doc = new GoogleSpreadsheet('1n01Pj7vZftKbmGW4SoLhankSl1Rqua7zwqqscPhN4ow');
    
    // 3. Autenticar
    await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    });
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
    console.error('Erro:', error.message);
  }
}

readSheet();