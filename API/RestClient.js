var request = require('request');

exports.getAccountsData = function getAccountsData(url, session, account, callback){
	request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetResponse(err,res,body) { 
		if (err) {
			console.log(err);
		} else {
			callback(body, session, account);
		}
	});
};


exports.getExchangeRate = function getExchangeRateData(url, session, base, symbol, callback){
	request.get(url, function(err,res,body){
		if(err){
			console.log(err);
		} else {
			callback(session, body, base, symbol);
		}
	});
}


exports.postAccountsData = function sendAccountData(url, account, session){
	var options = { // construct data
		url: url,
		method: 'POST',
		headers: {
			'ZUMO-API-VERSION': '2.0.0',
			'Content-Type':'application/json'
		},
		json: {
			"account" : account,
			"balance" : 0.0
		}
	};
	// request post
	request(options, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log(body);
		}
		else{
			console.log(error);
		}
	});
};


exports.deleteAccountData = function deleteAccountData(url,session, account, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if(!err && res.statusCode === 200){
            console.log(body);
            callback(body, session, account);
        }else {
            console.log(err);
            console.log(res);
        }
    });

};

exports.getFavouriteFood = function getData(url, session, username, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetReponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};

exports.postFavouriteFood = function SendData(url, username, favouriteFood){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "favouriteFood" : favouriteFood
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

exports.deleteFavouriteFood = function deleteData(url,session, username ,favouriteFood, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,username, favouriteFood);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};



