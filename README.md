# MSA CONTOSO CHATBOT

A web app, hosted on Microsoft Azure. This chat bot is presented for the MSA adv. training assessment.

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

There is an Azure Easytables listing of all of the user's accounts for the web app. The user may ask to create new accounts by simply greeting the bot with a new account name. The database stores the account name and the balance of the account. When a new account is created, a balance of 0 dollars is set. There is a set of dummy data already within the database to showcase the functionality of the accounts functionality. The dummy accounts are such as: 'accountname001'.

### Exchange Rates Checker

The user may ask for the exchange rates of the current market. Any time there is an exchange rate query, the fixer.io Web API is called. The user may ask for the exchange rate from NZD (as the base currency) to a single chosen currency or a choice of the exchange rate between two chosen currencies (e.g. AUD to USD). The fixer.io API takes its source data from a limited set of currencies provided by the European Central Bank. The user, at any time, may ask for the list of available currencies. The data is provided to the user through the Bot Framework card message.

### Insurance Queries via Image Links

The user may ask for insurance queries utilising image links. This is a demonstration of custom vision capabilities and the idea of quickly asking/assuming queries of the user with just a simple input of an image. If the user were to put in a house image link or vehicle image link, a response with the corresponding insurance is given as the reply.

