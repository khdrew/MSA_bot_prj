var rest = require('../API/RestClient');
var xe = require('../controller/ExchangeRate');

function getTableUrl() {
	return 'http://foodbot69.azurewebsites.net/tables/FoodTable';
}

exports.checkAccounts = function isExistingAcc(session, account){
	// var url = 'http://contosobotapp.azurewebsites.net/tables/AccountsTable';
	var url = getTableUrl();
	rest.getAccountsData(url, session, account, handleMakeAccounts);
}

function handleMakeAccounts (message, session, account) {
	var accountsResponse = JSON.parse(message);
	var existAccount = false
	console.log(account);
	for (var index in accountsResponse) {
		var accountName = accountsResponse[index].account;
		if (accountName == account) {
			existAccount = true
			session.send("Account accessed");
		}
	}
	if (existAccount === false) {
		makeNewAccount(account, session);
	}
}

function makeNewAccount (account, session) {
	// var url = 'http://contosobotapp.azurewebsites.net/tables/AccountsTable';
	var url = getTableUrl();
	rest.postAccountsData(url, account, session);
	session.send("New account created.");
}

exports.deleteAccount = function deleteAccount(session, account){
	// var url  = 'http://contosobotapp.azurewebsites.net/tables/AccountsTable';
	var url = getTableUrl();
	rest.getAccountsData(url, session, account, function (message, session, account){
		var accountsList = JSON.parse(message);
		for (var index in accountsList) {
			if (accountsList[index].account == account) {
				var id = accountsList[index].id;
				rest.deleteAccountData(url, session, account, id, function (message, session, account) {
					session.send("Account %s successfully deleted.", account);
					console.log('account delete, done');
				});
			}
		}
	});
}

exports.getAccountBalance = function getAccountBalance(session, account) {
	// var url = 'http://contosobotapp.azurewebsites.net/tables/AccountsTable';
	var url = getTableUrl();
	rest.getAccountsData(url, session, account, function (message, session, account) {
		var accountsList = JSON.parse(message);
		for (var index in accountsList) {
			if (accountsList[index].account == account) {
				session.send("Account balance for %s is at $%f.", account, accountsList[index].balance);	
			}
		}
	});
}

exports.buyCurrency = function buyCurency(session, currency, amount) {
	var account = session.conversationData["account"];
   if (!(typeof account === "undefined" || account === null)) { // check account set
   	var url = getTableUrl();
		rest.accountBuy(url, session, currency, amount, function (message, session, currency, amount){
			var accountsList = JSON.parse(message);
			var activeAcc = session.conversationData["account"];
			var accFound = false;
			for (var index in accountsList) {
				if (activeAcc == accountsList[index].account) {
					var accFound = true;
					session.send("Getting currency data...");
					xeUrl = xe.xeAPI(currency);
					rest.getSingleExchangeRate(xeUrl, session, accountsList[index].id, amount, accountsList[index].balance,	handleBuy);
				}
			}
			if (accFound == false) {
				session.send("Account does not exist.");
			}
		});	
	} else {
		session.send("Please specify an account name.");
	}
	
}

function handleBuy (session, body, id, amount, balance) {
	var ratesResponse = JSON.parse(body);
	for (var i in ratesResponse.rates) { // compute and send message
		var ratio = ratesResponse.rates[i];
		// var totalCost = (amount/ratio).toString();
		ratio = ratio.toString();
		// session.send(ratio);
		session.send("Your balance is %f, %s. buy %s %s", parseFloat(balance), id.toString(), amount.toString(), i.toString());

	}


}