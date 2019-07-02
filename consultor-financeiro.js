const axios = require('axios');
const cheerio = require('cheerio');
const treasuresBr = require('./tesouro');

module.exports = {
  currency: async () => {
    try { 
      const {data} = await axios.get('https://economia.uol.com.br/cotacoes/');
      const $ = cheerio.load(data);
      const table = $('.data-table.tableMoedas tbody');
      let response = "Essas são as cotações de algumas moedas agora: ";
      table.children().each(function() {
        const details = $(this).children();
        response += $(details[0]).text();
        response += $(details[1]).text()
          .replace('+', " subindo ")
          .replace('-', " caindo ");
        response += ' ,e está ';
        response += $(details[2]).text()
                              .replace('US', '')
                              .substr(0, $(details[2]).text().indexOf(',')+3);
        response += ", ";
      });
      return response;    
    } catch (err) {
      console.log(err);
      return "Houve um erro em obter os dados de moedas";
    }
  },
  ibov: async () => {
    try {
      const {data} = await axios.get('https://economia.uol.com.br/cotacoes/');
      const $ = cheerio.load(data);
      
      const ibov = $('.divGraficoBovespa a.subtituloGraficoPorcentagem').html()
        .replace('+', " subindo ")
        .replace('-', " caindo ");

      const pontos = $('.divGraficoBovespa .subtituloGrafico').html().replace("pts", '');
      
      let response = "";
      response += `O Ibovespa agora está ${pontos} pontos, ${ibov} `;
      return response;
    } catch (err) {
      console.log(err);
      return "Houve um erro em obter os dados do ibovespa";
    }

  },
  summary: async () => {
    try{
      const {data} = await axios.get('https://economia.uol.com.br/cotacoes/');
      const $ = cheerio.load(data);
      const summaryChildren = $( '.stock-rankings .row table tbody');
      const altasRaw = summaryChildren[0];
      const baixasRaw = summaryChildren[1];
      
      let altas = "As maiores altas do Ibovespa agora são: ";
      let baixas = "As maiores baixas do Ibovespa agora são: ";

      $(altasRaw).children().each(function() {
        const item = $(this).text()
        .replace('.SA', " ")
        .replace('+', " subindo ")
            .replace('R$', ", e está R$");
        altas += item;
        altas += ', ';
      })
    
      $(baixasRaw).children().each(function() {
        const item = $(this).text()
            .replace('-', " caindo ")
            .replace('R$', ", e está R$")
            baixas += item;
            baixas += ', ';
      })
      return altas+" "+baixas;
    } catch (err) {
      console.log(err);
      return "Houve um erro em obter os dados do ibovespa";
    }
  },
  macro: async () => {
    try {
      const {data} = await axios.get('https://economia.uol.com.br/cotacoes/');
      const $ = cheerio.load(data);
      
      const macro = $( '.financial-indicators .row table tbody')[0];
      let response = "Alguns dados econômicos importantes para você: ";
  
      $(macro).children().each(function() {
  
        const item = $(this).text();
        if(item.includes("TR") || item.includes("CDI")  || item.includes("SELIC") || item.includes("IPCA") ) {
          response += item.substr(0, item.indexOf('%')+1 )+', ';
        }
      })
      return response;
    } catch (err) {
      console.log(err);
      return "Houve um erro em obter os dados da economia";
    }
  },
  crypto:async () => {
    try { 
      let response = "No Bitcoin2U,"; 
      let bitcoin = (await axios.get('https://www.bitcointoyou.com/API/ticker.aspx')).data.ticker.last.replace('.', ',');
      response += `o Bitcoin está R$ ${bitcoin} `; 
      let litecoin = (await axios.get('https://www.bitcointoyou.com/API/ticker_litecoin.aspx')).data.ticker.last.replace('.', ',');
      response += `, e o Litecoin está R$ ${litecoin} `;     
      return response;
    } catch (err) {
      console.log(err);
      return "Houve um erro em obter os dados do bitcoin tiu iu";
    }
  },
  treasures: async () => {
    try { 
      const {data} = await axios.get('http://www.tesouro.fazenda.gov.br/tesouro-direto-precos-e-taxas-dos-titulos');
      console.log(data)
      return JSON.stringify(treasuresBr.get_data(data));
    } catch (err) {
      console.log(err);
      return "Houve um erro em obter os dados do tesouro, me desculpe";
    }
  }
}
