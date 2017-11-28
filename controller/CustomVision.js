var request = require('request'); //node module for http post requests

exports.retrieveMessage = function (session){
    console.log(">>>>>> " + session.message.text);
    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/dca47af4-ff87-40ce-a937-340dff634c3b/url?iterationId=d12a60b7-7473-48ee-90dc-be01cb557892',
      //url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/dca47af4-ff87-40ce-a937-340dff634c3b/image?iterationId=30ff3586-eeb7-4c9b-aef6-7d2583b1a7c8'
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'c7e0d15097ed4ab7a9939d45a4f06c78'
        },
        body: { 'url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

exports.retrieveMessageImage = function (session){
    console.log(">>>>>> " + session.message.attachments[0].contentUrl);
    console.log(">>>>>> " + session.message.attachments[0].contentType);
    console.log(">>>>>> " + session.message.attachments[0].name);
    retrieveMessage(session);
    // request.post({
    //     url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/dca47af4-ff87-40ce-a937-340dff634c3b/url?iterationId=30ff3586-eeb7-4c9b-aef6-7d2583b1a7c8',
    //   //url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/dca47af4-ff87-40ce-a937-340dff634c3b/image?iterationId=30ff3586-eeb7-4c9b-aef6-7d2583b1a7c8'
    //     json: true,
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Prediction-Key': 'c7e0d15097ed4ab7a9939d45a4f06c78'
    //     },
    //     body: { 'url': session.message.attachments[0].contentUrl }
    // }, function(error, response, body){
    //     console.log(validResponse(body));
    //     session.send(validResponse(body));
    // });
}


function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        var output = ""
        // console.log(body)
        switch(body.Predictions[0].Tag) {
            case 'car':
                output += 'Looking for vehicle insurance?';
                break;
            case 'house':
                output += 'Looking for house insurance?';
                break;
            case 'life':
                output += 'Looking for health insurance?';
                break;
        }
        return output
    } else{
        console.log('Oops, please try again!');
        console.log(body);
        return "Unrecognisable image..."
    }
}