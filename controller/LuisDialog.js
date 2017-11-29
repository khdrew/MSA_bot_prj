var builder = require('botbuilder');
var food = require('../controller/FavouriteFoods');
var xe = require('../controller/ExchangeRate');
var accs = require('../controller/AccountsData');
var customVision = require('../controller/CustomVision');
// Some sections have been omitted



exports.startDialog = function (bot) {

    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var endpointString = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/61397ea3-84dc-42b0-9f1f-c524cf65446d?subscription-key=dc4e9d363dad4ac0965a6bd77db1ef7e&verbose=true&timezoneOffset=0&q=';
    var recognizer = new builder.LuisRecognizer(endpointString);

    bot.recognizer(recognizer);

    bot.dialog('WelcomeIntent', [
        function (session, args, next) { // check if account number is found
            session.dialogData.args = args || {};
            var value = session.conversationData["account"];
            if (typeof value === "undefined" || value === null) { 
                builder.Prompts.text(session, "Please enter your account number to start our chat session.");       
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if(!isAttachment(session)){
                if (results.response) {
                    session.conversationData["account"] = results.response;
                    accs.checkAccounts(session, session.conversationData["account"]);
                    session.send("Account number: " + session.conversationData["account"]);
                    session.send("How can I help you? Check exchange rate, delete accounts, check balance or check insurance possiblities (post a picture link)? ");
                } else {
                    session.send("Account number: " + session.conversationData["account"]);
                    session.send("How can I help you? Check exchange rate, delete accounts, check balance or check insurance possiblities (post a picture link)? ");
                }                
            }
        }        
    ]).triggerAction({
        matches: 'WelcomeIntent'
    });



    bot.dialog('ExchangeRate', function (session, args) {
        if (!isAttachment(session)) {
            // Pulls out the currency targets from the session if it exists
            session.send('Retrieving exchange rates...');
            var curFrom = builder.EntityRecognizer.findEntity(args.intent.entities, 'curFrom');
            var curTo = builder.EntityRecognizer.findEntity(args.intent.entities, 'curTo');
            // Checks if the targets was found
            if (curTo && curFrom) {
                curFrom = curFrom.entity.toString().toUpperCase();
                curTo = curTo.entity.toString().toUpperCase();
                xe.displayExchangeRate(session, curFrom, curTo);
            } else if (curTo) {
                curTo = curTo.entity.toString().toUpperCase();
                xe.displayExchangeRate(session, 'NZD', curTo);
            } else {
                session.send("No target currencies identified! Please try again");
            }
        }

    }).triggerAction({
        matches: 'ExchangeRate'
    });


    bot.dialog('BuyCurrency', function (session, args) {
        if (!isAttachment(session)) {
            // Pulls out the currency targets from the session if it exists
            session.send('Processing buy request...');
            var targetCurrency = builder.EntityRecognizer.findEntity(args.intent.entities, 'targetCurrency');
            var amount = builder.EntityRecognizer.findEntity(args.intent.entities, 'amount');
            // Checks if the targets was found
            if (targetCurrency && amount) {
                targetCurrency = targetCurrency.entity.toString().toUpperCase();
                amount = parseFloat(amount.entity.toString().replace(/ /g, ""));
                accs.buyCurrency(session, targetCurrency, amount.toFixed(2));
            } else {
                session.send("No target currencies identified! Please try again");
            }
        }

    }).triggerAction({
        matches: 'BuyCurrency'
    });


    bot.dialog('ListExchangeRates', function (session, args) {
        if (!isAttachment(session)) {
            // Pulls out the currency targets from the session if it exists
            session.send('Retrieving exchange rates data...');
            xe.listExchangeRates(session);
        }

    }).triggerAction({
        matches: 'ListExchangeRates'
    });


    bot.dialog('DeleteAccount', function (session, args) {
        if (!isAttachment(session)) {
            var deleteTarget = builder.EntityRecognizer.findEntity(args.intent.entities, 'deleteTarget');
            var accVal = session.conversationData["account"];
            
            if (deleteTarget) {
                session.send("Request delete %s account...", deleteTarget.entity.toString());
                accs.deleteAccount(session, deleteTarget.entity.toString());
                if (!(typeof accVal === "undefined" || accVal === null)) { 
                    if (deleteTarget == accVal) {
                        logout_account(session);
                    }
                }
            } else if (!(typeof accVal === "undefined" || accVal === null)) { 
                session.send("Request delete %s account...", session.conversationData["account"]);
                accs.deleteAccount(session, accVal);
                logout_account(session);
            } else {
                session.send("No target account to delete.");
            }
        }
    }).triggerAction({
        matches: 'DeleteAccount'
    });


    bot.dialog('CheckBalance', function (session, args) {
        if (!isAttachment(session)) {
            var accVal = session.conversationData["account"];
            if (!(typeof accVal === "undefined" || accVal === null)) { 
                session.send("Checking balance of %s...", accVal);
                accs.getAccountBalance(session, accVal);
            } else {
                session.send("No target account to check balance.");
            }
        }
    }).triggerAction({
        matches: 'CheckBalance'
    });


    bot.dialog('ChangeAccount', function (session, args) {
        if (!isAttachment(session)) {
            var accVal = session.conversationData["account"];
            if (!(typeof accVal === "undefined" || accVal === null)) { 
                session.send("Checking out of %s account...", accVal);
                logout_account(session);
            } else {
                session.send("No target account to check balance.");
            }
        }
    }).triggerAction({
        matches: 'ChangeAccount'
    });


    bot.dialog('Link', function (session, args) {
        isAttachment(session);
    }).triggerAction({
        matches: 'Link'
    });



    function logout_account(session){
        session.conversationData["account"] = null;
    }

   
    // Function is called when the user inputs an attachment
    function isAttachment(session) { 
        var msg = session.message.text;
        if (msg.includes("http")) {
            session.send('Calling custom vision processing for link...');
            customVision.retrieveMessage(session);
            return true;
        } else if (session.message.attachments && session.message.attachments.length > 0) {
            session.send('Calling custom vision processing for image...');
            customVision.retrieveMessageImage(session);
        } else {
            return false;
        }
    }

}


    // Function is called when the user inputs an attachment
    exports.isAttachment = function isAttachment(session){ 
        var msg = session.message.text;
        if (msg.includes("http")) {
            session.send('Calling custom vision processing for link...');
            customVision.retrieveMessage(session);
            return true;
        } else if (session.message.attachments && session.message.attachments.length > 0) {
            session.send('Calling custom vision processing for image...');
            customVision.retrieveMessageImage(session);
        } else {
            return false;
        }
    }


