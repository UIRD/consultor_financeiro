const tesouro = require('./tesouro');
const cotacoes = require('./consultor-fainceiro');
// tesouro.starter(function(data) {
//   console.log(data)
// });

const oi = async () => {
  console.log(await cotacoes.currency());
  console.log(await cotacoes.ibov());
  console.log(await cotacoes.summary());
  console.log(await cotacoes.macro());
}

oi();
