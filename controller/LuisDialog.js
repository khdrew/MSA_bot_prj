var builder = require('botbuilder');
// Some sections have been omitted

exports.startDialog = function (bot) {

    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var endpointString = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/795f0e51-4485-46fe-a554-ce3df26749b6?subscription-key=dc4e9d363dad4ac0965a6bd77db1ef7e&timezoneOffset=0&q=';
    var recognizer = new builder.LuisRecognizer(endpointString);

    bot.recognizer(recognizer);

    bot.dialog('WantFood', function (session, args) {
        if (!isAttachment(session)) {
            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the food entity was found
            if (foodEntity) {
                session.send('Looking for restaurants which sell %s...', foodEntity.entity);
                // Insert logic here later
            } else {
                session.send("No food identified! Please try again");
            }
        }

    }).triggerAction({
        matches: 'WantFood'
    });

    bot.dialog('DeleteFavourite', function (session, args) {
        if (!isAttachment(session)) {
            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the food entity was found
            if (foodEntity) {
                session.send('Deleting %s...', foodEntity.entity);
                // Insert logic here later
            } else {
                session.send("No food identified! Please try again");
            }
        }

    }).triggerAction({
        matches: 'DeleteFavourite'

    });

    bot.dialog('GetCalories', function (session, args) {
        if (!isAttachment(session)) {

            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Calculating calories in %s...', foodEntity.entity);
               // Here you would call a function to get the foods nutrition information

           } else {
            session.send("No food identified! Please try again");
        }
    }
}).triggerAction({
    matches: 'GetCalories'
});


bot.dialog('GetFavouriteFood', function (session, args) {
    if (!isAttachment(session)) {
        session.send("Your favourite food is...");
    }
}).triggerAction({
   matches: 'GetFavouriteFood'
});

bot.dialog('LookForFavourite', function (session, args) {
    if (!isAttachment(session)) {
            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the food entity was found
            if (foodEntity) {
                session.send('Your favourite food is %s...', foodEntity.entity);
                // Insert logic here later
            } else {
                session.send("No food identified! Please try again");
            }
        }

    }).triggerAction({
       matches: 'LookForFavourite'
   });


    bot.dialog('WelcomeIntent', function (session, args) {
        if (!isAttachment(session)) {
            session.send("g'day mate");
        }

    }

    ).triggerAction({
       matches: 'WelcomeIntent'
   });

}



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