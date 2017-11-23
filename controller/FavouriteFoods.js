var rest = require('../API/RestClient');

exports.displayFavouriteFood = function getFavouriteFood(session, username){
    var url = 'http://foodbot69.azurewebsites.net/tables/FoodTable';
    rest.getFavouriteFood(url, session, username, handleFavouriteFoodResponse)
};

function handleFavouriteFoodResponse(message, session, username) {
    var favouriteFoodResponse = JSON.parse(message);
    var allFoods = [];
    for (var index in favouriteFoodResponse) {
        var usernameReceived = favouriteFoodResponse[index].username;
        var favouriteFood = favouriteFoodResponse[index].favouriteFood;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after all favourite foods unless last one
            if(favouriteFoodResponse.length - 1) {
                allFoods.push(favouriteFood);
            }
            else {
                allFoods.push(favouriteFood + ', ');
            }
        }        
    }
    
    // Print all favourite foods for the user that is currently logged in
    session.send("%s, your favourite foods are: %s", username, allFoods);                
    
}

exports.deleteFavouriteFood = function deleteFavouriteFood(session,username,favouriteFood){
    var url  = 'http://foodbot69.azurewebsites.net/tables/FoodTable';

    rest.getFavouriteFood(url,session, username,function(message,session,username){
     var   allFoods = JSON.parse(message);

        for(var i in allFoods) {

            if (allFoods[i].favouriteFood === favouriteFood && allFoods[i].username === username) {

                console.log(allFoods[i]);

                rest.deleteFavouriteFood(url,session,username,favouriteFood, allFoods[i].id ,handleDeletedFoodResponse)

            }
        }


    });
};

exports.sendFavouriteFood = function postFavouriteFood(session, username, favouriteFood){
    var url = 'http://foodbot69.azurewebsites.net/tables/FoodTable';
    rest.postFavouriteFood(url, username, favouriteFood);
};