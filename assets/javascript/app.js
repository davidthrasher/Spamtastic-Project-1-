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

// research axios

//Establish Global Variables
var database = firebase.database();
var userNumber = "";
var reverseKey = "9608ae9a2c4d4ff89e6e11b6c07304ba";
var reputationKey = "717e3976df9a4ddba7f5cf0f139ba0d2";
var mapsKey = "AIzaSyCsptyS96_W0OHNgvk792B6ASpVNdM6tqA";

var retrievedPerson = {
  fullName: ''
}

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

function writeReverseInfo(object) {
  //Need an If/Else statement to provide placeholder name in the event that no name is available from API.
 master
  var person = "";
  var carrier = "";
  if (object.belongs_to[0].firstname && object.belongs_to[0].lastname) {
    person = object.belongs_to[0].firstname + ' ' + object.belongs_to[0].lastname;
  } else if (object.belongs_to[0].firstname) {
    person = object.belongs_to[0].firstname;
  } else if (object.belongs_to[0].lastname) {
    person = object.belongs_to[0].lastname;
  } else {
    person = "Not Available";
  }

  if (object.carrier) {
    carrier = object.carrier;
  } else {
    carrier = "Not Available";
  }
    

  var person = object.belongs_to[0].firstname + ' ' + object.belongs_to[0].lastname;
  var carrier = object.carrier;

  var lat = object.current_addresses.object.lat_long.latitude;
  var lng = object.current_addresses.object.lat_long.longitude;
  console.log(lat);
  console.log(lng);


  var $row = $('<tr>');
  $row.append($('<td>').text(person));
  $row.append($('<td>').text(carrier));
  $('#number-info').append($row);
}

function writeReputationInfo(object) {
  var reputation = object.reputation_level;
  var callType = object.reputation_details.type;
  console.log(callType);

  var $row = $('<tr>');
  $row.append($('<td>').text(reputation));
  $row.append($('<td>').text(callType));
  $('#number-info').append($row);
}

//Creating main function that happens upon number submit click.
$("#add-number-btn").on("click", function(event) {
    event.preventDefault();

    $("#number-info").empty();

    userNumber = $("#number-input").val().trim();

    var queryURLReverse = "https://proapi.whitepages.com/3.0/phone?phone=" + userNumber + "&api_key=" + reverseKey;

    var queryURLReputation = "https://proapi.whitepages.com/3.0/phone_reputation?phone=" + userNumber + "&api_key=" + reputationKey;

    makeRequest(queryURLReverse, writeReverseInfo);
    makeRequest(queryURLReputation, writeReputationInfo);


});
