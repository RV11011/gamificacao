require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');

const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

async function testPersonalMetrics(atendente) {
  try {
    console.log(`Buscando métricas para: ${atendente}`);
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    console.log('Conectado à planilha com sucesso');
    
    const sheet = doc.sheetsByTitle['Cálculo de XP'];
    if (!sheet) throw new Error('Aba não encontrada');

    console.log('Aba "Cálculo de XP" encontrada');
    
    const rows = await sheet.getRows();
    const userMetrics = rows.find(row => row.Atendente === atendente);

    if (userMetrics) {
      const metrics = {
        atendente: userMetrics.Atendente,
        funcao: userMetrics.Função,
        metricas: {
          atendimentos: {
            total: parseInt(userMetrics.Atendimentos) || 0,
            tmf: parseInt(userMetrics.TMF) || 0,
            tma: parseInt(userMetrics.TMA) || 0
          },
          implantacoes: parseInt(userMetrics.Implantações) || 0,
          qualidade: {
            errosDocumentacao: parseInt(userMetrics['Erros de Documentação']) || 0,
            sla: parseInt(userMetrics['SLA no Prazo']) || 0,
            mediaScore: parseInt(userMetrics['Média Score']) || 0,
            taxaAvaliacao: parseInt(userMetrics['Taxa de Avaliação']) || 0,
            notasJustas: parseInt(userMetrics['Notas Justas']) || 0
          },
          problemas: {
            comportamentais: parseInt(userMetrics['Problemas Comportamentais']) || 0,
            tecnicos: parseInt(userMetrics['Problemas Técnicos']) || 0,
            criticos: parseInt(userMetrics['Problemas Críticos']) || 0
          },
          desenvolvimento: {
            treinamentosParticipados: parseInt(userMetrics['Treinamento participado']) || 0,
            treinamentosRealizados: parseInt(userMetrics['Treinamento realizado']) || 0,
            projetos: parseInt(userMetrics['Projetos/Desafios']) || 0,
            pdis: parseInt(userMetrics.PDIs) || 0
          },
          cartoes: {
            falha: parseInt(userMetrics['Cartões de Falha']) || 0,
            melhoria: parseInt(userMetrics['Cartões de Melhoria']) || 0,
            tarefa: parseInt(userMetrics['Cartões de Tarefa']) || 0
          },
          ajusteGM: parseInt(userMetrics['Ajuste do GM']) || 0,
          totalXP: parseInt(userMetrics.Total) || 0
        }
      };

      console.log('\nMétricas encontradas:');
      console.log(JSON.stringify(metrics, null, 2));
    } else {
      console.log(`\nNenhuma métrica encontrada para o usuário: ${atendente}`);
    }
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
  }
}

// Testa alguns atendentes
const atendentesToTest = [
  'Francisco Júnior Pansera Zattera',
  'Emerson Henrique Comar',
  'Rafael Vargas Rodrigues Alves'
];

atendentesToTest.forEach(atendente => {
  testPersonalMetrics(atendente);
});