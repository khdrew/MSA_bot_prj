var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/dca47af4-ff87-40ce-a937-340dff634c3b/url?iterationId=30ff3586-eeb7-4c9b-aef6-7d2583b1a7c8',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'c7e0d15097ed4ab7a9939d45a4f06c78'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
    }
}