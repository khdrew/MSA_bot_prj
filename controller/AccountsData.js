var rest = require('../API/RestClient');

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


