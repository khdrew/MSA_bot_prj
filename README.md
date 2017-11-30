# MSA CONTOSO CHATBOT

A web app hosted on Microsoft Azure. This chat bot is presented for the MSA adv. training assessment.

The chat bot is hosted on a responsive showcase website at the following link:

http://contosowebpage.azurewebsites.net/



## Local Run Instructions

The bot framework requires the following prerequisites:

- Bot Framework Channel Emulator: https://github.com/Microsoft/BotFramework-Emulator
- Nodejs: https://nodejs.org/en/

Follow these steps for local emulation:

1. Open up a console and change to file directory
2. Enter command: `node app.js`
3. Open up the bot framework channel emulator
4. Enter endpoint URL with the default `http://localhost:3978/api/messages`
5. Set Microsoft App ID: `749b6c06-1705-4f00-9112-bcb266a34b40`
6. Set Microsoft App Password: `spauYFI6432%(=ycdSKXL7@`
7. Connect and Enjoy



## Functionality of Chat bot

### Accounts

There is an Azure Easytables listing of all of the user's accounts for the web app. The user may ask to create new accounts by simply greeting the bot with a new account name. The database stores the account name and the balance of the account. When a new account is created, a balance of 0 dollars is set. There is a set of dummy data already within the database to showcase the functionality of the accounts functionality. The dummy accounts are such as: 'accountname001'. Each database entry contains the name of their account, their balance and a range of different foreign currencies. Due to Easytables, new column entries may be added at anytime when required.

### Exchange Rates Checker

The user may ask for the exchange rates of the current market. Any time there is an exchange rate query, the fixer.io Web API is called. The user may ask for the exchange rate from NZD (as the base currency) to a single chosen currency or a choice of the exchange rate between two chosen currencies (e.g. AUD to USD). The fixer.io API takes its source data from a limited set of currencies provided by the European Central Bank. The user, at any time, may ask for the list of available currencies. The data is provided to the user through the Bot Framework card message along with flag images (provided by <http://flags.fmcdn.net/data/flags/w580/>) that correspond to the currencies of interest. On top of this, users may ask to buy currencies with their account. Their respective balances will be updated accordingly with their choice of purchase. Checks are made to account balances before purchases can be made to make sure users do not go to overdraft in account balances.

### Insurance Queries via Image Links

The user may ask for insurance queries utilising image links. This is a demonstration of custom vision capabilities and the idea of quickly asking/assuming queries of the user with just a simple input of an image. If the user were to put in a house image link or vehicle image link, a response with the corresponding insurance is given as the reply.



## Future Considerations

The chat bot is a proof of concept, in order to showcase the bot framework in action. As a result, some crucial features for accessing to bank details may not be secure. So for full fledged integration to a real bank database, a few adjustments would be needed.

### Security

The idea for a secure login system should be implemented before allowing any user to talk to the bot. A secure hash/encrypted key should be kept once access is granted. This will allow for all queries and data transfers to be safe at all times. This would also allow for the bot to recognize which accounts the user is able to access for transactions.



### Increasing Artificial Intelligence Further

As this is a chat bot with a form of artificial intelligence integrated into its core functionality. It would be better if the intelligence would be further improved to suit the bank scenario. However due to the computation complexity in AI, web service hosting maybe an option for future development for Azure services instead of local processing done on user computers.

#### Kalman Filter - Stock/FX/Crypto prediction 

There is observable statistical noise and other levels of inaccuracies when dealing with stocks, foreign exchange, crypto and many other market data alike. Due to this observation, predictions can be formulated with the help of a Kalman filter.

The Kalman filter has a multitude of different applications when dealing with data sets that have apparent varying data points but with an overarching trend. As a result this system is not limited to market data predictions, but also being able to reach out to applications such as robot localization, temperature sensors or computer vision, etc. the list goes on.

With this Kalman filtering, a prediction of market trends can be provided to the user, to improve user experiences in making financial investment decisions.

####Reinforcement Learning - Markovian process

Further improvements can be made on top of the financial prediction functionality. Through Reinforcement Learning or Markovian problem-solving, said predictions can be extended upon. This will provide simulations of said predictions and through experiencing rewards, the bot will come to understand the gravity of going through with certain financial decisions.

This will eventually lead to something that may provide optimal policies for helping users choose which is the best options to take when making financial investment decisions.

