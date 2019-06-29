var cheerio = require('cheerio');
var http = require('http');

var extract = {
    extraction_info: [],
    callback: null,

    starter: function(callback) {
        this.callback = callback;

        var options = {
            host: 'www.tesouro.fazenda.gov.br',
            path: '/tesouro-direto-precos-e-taxas-dos-titulos'
        }

        var request = http.request(options, function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
            });

            res.on('end', function() {
                extract.get_data(data);
            });
        });

        request.on('error', function(e) {
            console.log(e.message);
        });

        request.end();
    },

    get_data: function(data) {
        let parseTableLines = function(trs, withMinValue) {
            trs = trs.map(tr => $(tr).children('td').toArray() );
            let values = trs.map(tr => tr.map(td => $(td).text()));
            return values.map(titulo => extract.tesouroObjectify(titulo, withMinValue) );
        };
        let $ = cheerio.load(data);
        let invest = $('.portlet-body > table.tabelaPrecoseTaxas:not(".sanfonado") tbody tr.camposTesouroDireto').toArray();
        let rescue = $('.portlet-body > .sanfonado table.tabelaPrecoseTaxas tbody tr.camposTesouroDireto').toArray();
        let status = $('.mercadostatus').attr('class').split(' ').filter(function(e) {return 'mercadostatus' !== e; });
        let lastUpdate = $('.portlet-body > b').text();
        let updated = new Date(lastUpdate.replace( /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, "$2/$1/$3 $4:$5"));

        return  parseTableLines(invest, true);
    },

    

    tesouroObjectify: function (element, withMinValue) {
        if(element[0].includes("IPCA"))
            return `${element[0]}, Vencimento: ${element[1]}, taxa De Rendimento: IPCA + ${element[2]} % , valor Mínimo: ${element[3] }, preço Unitário: ${element[4]}`
        if(element[0].includes("SELIC"))
            return `${element[0]}, Vencimento: ${element[1]}, taxa De Rendimento: SELIC + ${element[2]} % , valor Mínimo: ${element[3] }, preço Unitário: ${element[4]}`
        return `${element[0]}, Vencimento: ${element[1]}, taxa De Rendimento: ${element[2]} % , valor Mínimo: ${element[3] }, preço Unitário: ${element[4]}`

    },

    formatMoneyToFloat: function (str) {
        return str.replace(/[\D]+/g,'').replace(/([0-9]{2})$/g, ".$1");
    }
}

module.exports = extract;
