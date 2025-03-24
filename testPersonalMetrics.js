require('dotenv').config();
const { getPersonalMetrics } = require('./readPersonalMetrics');

async function testPersonalMetrics(atendente) {
  try {
    const metrics = await getPersonalMetrics(atendente);
    if (metrics) {
      console.log(`\nMétricas para ${atendente}:`);
      console.log(JSON.stringify(metrics, null, 2));
    } else {
      console.log(`\nNenhuma métrica encontrada para o atendente: ${atendente}`);
    }
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
  }
}

// Testar alguns atendentes
const atendentesToTest = [
  'Alifer Vinicius Tibes',
  'Alysson Alquieri Kooke',
  'André Filipe Lima Valença Pereira'
];

atendentesToTest.forEach(atendente => {
  testPersonalMetrics(atendente);
});