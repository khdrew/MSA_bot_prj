var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');


// Some sections have been omitted

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
	// appId: process.env.MICROSOFT_APP_ID,
	// appPassword: process.env.MICROSOFT_APP_PASSWORD
	appId : '749b6c06-1705-4f00-9112-bcb266a34b40',
	appPassword: 'spauYFI6432%(=ycdSKXL7@'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
	if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
		session.send('Image processing?');
		luis.isAttachment(session);
	} else {
		session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
	}
});


// greetings message
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new builder.Message()
                    .address(message.address)
                    .text('Hi! I am Contoso Chat Bot.');
                bot.send(reply);
            }
        });
    }
});

// This line will call the function in the LuisDialog.js file
luis.startDialog(bot);


// spauYFI6432%(=ycdSKXL7@