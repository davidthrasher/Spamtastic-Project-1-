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

function makeRequest(url, cb) {
  $.ajax({
    url: url,
    method: "GET"
  })
  .done(function(response){
    console.log(response);
    cb(response);
  });
}

function writePhoneInfo(object) {
  var person = object.belongs_to[0].firstname + ' ' + object.belongs_to[0].lastname;
  console.log(person);
  var carrier = object.carrier;
  console.log(carrier);
  var reputation = object.reputation_level;
  console.log(reputation);
  var callType = object.reputation_details;
  console.log(callType);
  var location = object.current_addresses[0].lat_long[1,2];
  console.log(location);

  var $row = $('<tr>');
  $row.append($('<td>').text(person));
  $row.append($('<td>').text(carrier));
  $row.append($('<td>').text(reputation));
  $row.append($('<td>').text(callType));
  $('#number-info').append($row);
}

//Creating main function that happens upon number submit click.
$("#add-number-btn").on("click", function(event) {
    event.preventDefault();

    userNumber = $("#number-input").val().trim();

    var queryURLReverse = "https://proapi.whitepages.com/3.0/phone?phone=" + userNumber + "&api_key=" + reverseKey;

    var queryURLReputation = "https://proapi.whitepages.com/3.0/phone_reputation?phone=" + userNumber + "&api_key=" + reputationKey;

    console.log(queryURLReverse);
    console.log(queryURLReputation);

    makeRequest(queryURLReverse, writePhoneInfo);
    makeRequest(queryURLReputation, writePhoneInfo);

});
