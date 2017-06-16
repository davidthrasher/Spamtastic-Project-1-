// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBPoB3vEaH9uWLWw0q-eXGIQEgNvU23uJs",
    authDomain: "spamtastic-255ab.firebaseapp.com",
    databaseURL: "https://spamtastic-255ab.firebaseio.com",
    projectId: "spamtastic-255ab",
    storageBucket: "",
    messagingSenderId: "851277849763"
  };
  firebase.initializeApp(config);

//Establish Global Variables
var database = firebase.database();

var userNumber = "";

var reverseKey = "9608ae9a2c4d4ff89e6e11b6c07304ba";

var reputationKey = "717e3976df9a4ddba7f5cf0f139ba0d2";

var mapsKey = "AIzaSyCsptyS96_W0OHNgvk792B6ASpVNdM6tqA";

//Creating main function that happens upon number submit click.
$("#add-number-btn").on("click", function(event) {
    event.preventDefault();

    userNumber = $("#number-input").val().trim();

    var queryURLReverse = "https://proapi.whitepages.com/3.0/phone?phone=" + userNumber + "&api_key=" + reverseKey;

    var queryURLReputation = "https://proapi.whitepages.com/3.0/phone_reputation?phone=" + userNumber + "&api_key=" + reputationKey;

    console.log(queryURLReverse);
    console.log(queryURLReputation);

    $.ajax({
  		url: queryURLReverse,
  		method: "GET"
  	})
    .done(function(response){
      console.log(response);
    });

    $.ajax({
  		url: queryURLReputation,
  		method: "GET"
  	})
    .done(function(response){
      console.log(response);
    });

});
