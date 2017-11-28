var rest = require('../API/RestClient');
var builder = require('botbuilder');

exports.displayExchangeRate = function (session, base, symbol) {
	var url = 'https://api.fixer.io/latest?base=' + base + '&symbols=' + symbol; // build url
	rest.getExchangeRate(url, session, base, symbol, extractRate); // call api
};


function extractRate (session, message, base, symbol) {
	var ratesResponse = JSON.parse(message); // parse JSON
	if (ratesResponse.base == base) {
		var symbolFound = false
		var attachment = [];
		for (var i in ratesResponse.rates) { // compute and send message
			if (i.toString() == symbol) {
				var card = new builder.HeroCard(session)
					.title(base + '/' + symbol)
					.text('Converstion rate 1 ' + base + ' to ' + ratesResponse.rates[i].toString() + ' ' + symbol + '.')
					.images([builder.CardImage.create(session, 'http://flags.fmcdn.net/data/flags/w580/' + base.toLowerCase().substring(0,2) + '.png'),
						builder.CardImage.create(session, 'http://flags.fmcdn.net/data/flags/w580/' + symbol.toLowerCase().substring(0,2) + '.png')])
					.buttons([builder.CardAction.openUrl(session, 'https://finance.google.com/finance/converter', 'More Exchange Rate Conversions')]);
				attachment.push(card);
				session.send('Converstion rate 1 %s to %s %s.', base, ratesResponse.rates[i].toString(), symbol);
				symbolFound = true;
			}
		}
		if (symbolFound == false) {
			session.send("Unable to find symbol currency");
		} else {
			var message = new builder.Message(session)
					.attachmentLayout(builder.AttachmentLayout.carousel)
				.attachments(attachment);
			session.send(message);
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
		var title = 'Currency List';
		// var imgArray = []

		var text = "Available currency conversions are: ";
		for (var i in ratesResponse.rates) {
			text += i.toString() + ', ';
			// imgArray.push(builder.CardImage.create(session, 'http://flags.fmcdn.net/data/flags/w580/' + i.toLowerCase().substring(0,2) + '.png'))
		}
		text += "Default base currency is NZD.";

		var attachment = [];
		// session.send(outPrint);
		var card = new builder.HeroCard(session)
			.title(title)
			.text(text)
			// .images(imgArray)
			.buttons([builder.CardAction.openUrl(session, 'https://finance.google.com/finance/converter', 'More Exchange Rate Conversions')]);
		attachment.push(card);
		var message = new builder.Message(session)
			.attachmentLayout(builder.AttachmentLayout.carousel)
			.attachments(attachment);
		session.send(message);
	});
}