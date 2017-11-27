var rest = require('../API/RestClient');

exports.displayExchangeRate = function (session, base, symbol) {
	var url = 'https://api.fixer.io/latest?base=' + base + '&symbols=' + symbol; // build url
	rest.getExchangeRate(url, session, base, symbol, extractRate); // call api
};


function extractRate (session, message, base, symbol) {
	var ratesResponse = JSON.parse(message); // parse JSON
	if (ratesResponse.base == base) {
		for (var i in ratesResponse.rates) { // compute and send message
			if (i.toString() == symbol) {
				session.send('Converstion rate 1 %s to %s %s.', base, ratesResponse.rates[i].toString(), symbol);
			}
		}
	}
}