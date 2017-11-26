var builder = require('botbuilder');
var food = require('../controller/FavouriteFoods');
var xe = require('../controller/ExchangeRate');
var accs = require('../controller/AccountsData');
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
                } else {
                    session.send("How can I help you?");
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


    bot.dialog('DeleteAccount', function (session, args) {
        if (!isAttachment(session)) {
            var deleteTarget = builder.EntityRecognizer.findEntity(args.intent.entities, 'deleteTarget');
            var accVal = session.conversationData["account"];
            
            if (deleteTarget) {
                session.send("Request delete %s account...", deleteTarget.entity.toString());
                accs.deleteAccount(session, deleteTarget.entity.toString());
                if (!(typeof accVal === "undefined" || accVal === null)) { 
                    if (deleteTarget == accVal) {
                        session.conversationData["account"] = null;
                    }
                }
            } else if (!(typeof accVal === "undefined" || accVal === null)) { 
                session.send("Request delete %s account...", session.conversationData["account"]);
                accs.deleteAccount(session, accVal);
                session.conversationData["account"] = null;
            } else {
                session.send("No target account to delete.");
            }
        }
    }).triggerAction({
        matches: 'DeleteAccount'
    });


   

    // bot.dialog('GetCalories', function (session, args) {
    //     if (!isAttachment(session)) {

    //         // Pulls out the food entity from the session if it exists
    //         var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

    //         // Checks if the for entity was found
    //         if (foodEntity) {
    //             session.send('Calculating calories in %s...', foodEntity.entity);
    //            // Here you would call a function to get the foods nutrition information

    //         } else {
    //             session.send("GetCalories");
    //             session.send("No food identified! Please try again");
    //         }
    //     }
    // }).triggerAction({
    //     matches: 'GetCalories'
    // });


    // bot.dialog('GetFavouriteFood', [
    //     function (session, args, next) {
    //         session.dialogData.args = args || {};        
    //         if (!session.conversationData["username"]) {
    //             builder.Prompts.text(session, "Enter a username to setup your account.");                
    //         } else {
    //             next(); // Skip if we already have this info.
    //         }
    //     },
    //     function (session, results, next) {
    //         if (!isAttachment(session)) {

    //             if (results.response) {
    //                 session.conversationData["username"] = results.response;
    //             }

    //             session.send("Retrieving your favourite foods for: " + session.conversationData["username"]);
    //             food.displayFavouriteFood(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
    //         }
    //     }
    // ]).triggerAction({
    //     matches: 'GetFavouriteFood'
    // });

    // bot.dialog('LookForFavourite', [
    //     function (session, args, next) {
    //         session.dialogData.args = args || {};        
    //         if (!session.conversationData["username"]) {
    //             builder.Prompts.text(session, "Enter a username to setup your account.");                
    //         } else {
    //             next(); // Skip if we already have this info.
    //         }
    //     },
    //     function (session, results, next) {
    //         if (!isAttachment(session)) {

    //             if (results.response) {
    //                 session.conversationData["username"] = results.response;
    //             }
    //             // Pulls out the food entity from the session if it exists
    //             var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');
    
    //             // Checks if the food entity was found
    //             if (foodEntity) {
    //                 session.send('Thanks for telling me that \'%s\' is your favourite food', foodEntity.entity);
    //                 food.sendFavouriteFood(session, session.conversationData["username"], foodEntity.entity); // <-- LINE WE WANT    
    //             } else {
    //                 session.send("No food identified!!!");
    //             }
    //         }
    //     }
    // ]).triggerAction({
    //     matches: 'LookForFavourite'
    // });


    // bot.dialog('WelcomeIntent', function (session, args) {
    //     if (!isAttachment(session)) {
    //         session.send("g'day mate");
    //     }

    // }).triggerAction({
    //     matches: 'WelcomeIntent'
    // });

    // Function is called when the user inputs an attachment
    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {

            //call custom vision here later
            return true;
        }
        else {
            return false;
        }
    }

    //     function (session, results,next) {
    //         if (!isAttachment(session)) {

    //             session.send("You want to delete one of your favourite foods.");

    //             // Pulls out the food entity from the session if it exists
    //             var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');

    //             // Checks if the for entity was found
    //             if (foodEntity) {
    //                 session.send('Deleting \'%s\'...', foodEntity.entity);
    //                 food.deleteFavouriteFood(session,session.conversationData['username'],foodEntity.entity); //<--- CALLL WE WANT
    //             } else {
    //                 session.send("No food identified! Please try again");
    //             }
    //         }
    //     }



}





