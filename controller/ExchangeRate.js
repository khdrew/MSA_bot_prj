var rest = require('../API/RestClient');

exports.displayExchangeRate = function (session, base, symbol) {
	var url = 'https://api.fixer.io/latest?base=' + base + '&symbols=' + symbol; // build url
	rest.getExchangeRate(url, session, base, symbol, extractRate); // call api
};


function extractRate (session, message, base, symbol) {
	var ratesResponse = JSON.parse(message); // parse JSON
	if (ratesResponse.base == base) {
		var symbolFound = false
		for (var i in ratesResponse.rates) { // compute and send message
			if (i.toString() == symbol) {
				session.send('Converstion rate 1 %s to %s %s.', base, ratesResponse.rates[i].toString(), symbol);
				symbolFound = true;
			}
		}
		if (symbolFound == true) {

		}
	} else {
		session.send("Unable to find base currency");
	}
}

exports.listExchangeRates = function (session) {
	var url = 'https://api.fixer.io/latest?base=NZD';
	var base = 'NZD';
	var symbol = '';
	rest.getExchangeRate(url, session, base, symbol, function (session, message, base, symbol) {
		var ratesResponse = JSON.parse(message);
		var outPrint = "Available currency conversions are: ";
		for (var i in ratesResponse.rates) {
			outPrint += i.toString() + ', ';
		}
		outPrint += "Default base currency is NZD.";
		session.send(outPrint);
	});
}