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

var database = firebase.database();

//Establish Global Variables
var database = firebase.database();
var userNumber = "";
var reverseKey = "47274e63692f4997a88f0d2291bcf909";
var reputationKey = "0e7a90e1217f426db440eda4ed84a3e3";
var mapsKey = "AIzaSyCsptyS96_W0OHNgvk792B6ASpVNdM6tqA";

//Get reputation and type of spam call
function writeReputationInfo(object) {
  console.log(object);
  var reputation = object.data.reputation_details.score + "%";
  var callType = "";
  if (object.data.reputation_details.category = "null") {
    callType = object.data.reputation_details.type;
  } else {
    callType = object.data.reputation_details.category;
  }

  console.log("===== Reputation: " + reputation);
  console.log("===== Call Type: " + callType);

  return {
    reputation: reputation,
    callType: callType
  }
}//end of writeReputation

//retrieve person, carrier, and call location info, create map location
function writeReverseInfo(object) {

    console.log(object);
    var person = "";
    var carrier = "";

    //check for name if available
    if (object.data.belongs_to.length && object.data.belongs_to[0].firstname === null && object.data.belongs_to[0].lastname === null){
      person = "Not Available";
    } else if (object.data.belongs_to.length) {
      person = object.data.belongs_to[0].firstname + ' ' + object.data.belongs_to[0].lastname;
    } else {
      person = "Not Available";
    }


    var carrier = object.data.carrier;
    console.log("===== Caller: " + person);
    console.log("===== Carrier: " + carrier);
    var lat = object.data.current_addresses[0].lat_long.latitude;
    var lng = object.data.current_addresses[0].lat_long.longitude;
    console.log(lat);
    console.log(lng);

    //get city, state, and country from call
    var city = object.data.current_addresses[0].city;
    var state = object.data.current_addresses[0].state_code;
    var country = object.data.current_addresses[0].country_code;
    console.log(city);

    //combine city, state, and country to create callLocation
    var callLocation = city + ', ' + state + ', ' + country;
    console.log("==== Location: " + callLocation);

  //Ready handler
  $(document).ready(function(){
    initMap();
  });
    //create google maps with lat/lng
    function initMap() {
        var latlng = new google.maps.LatLng(lat, lng);
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 6,
          center: latlng,
          mapTypeId: "hybrid"
        });
        var marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
  }//end of initMap

  return {
    person: person,
    carrier: carrier,
    callLocation: callLocation
  }//end of return
}//end of writeReverseInfo

//Creating main function that happens upon number submit click.
$("#add-number-btn").on("click", function(event) {
  //Preventing default behavior for click event.
    event.preventDefault();

//Clearing out both divs that are being written to in the DOM.
    $("#number-info").empty();
    $("#error-message").empty();

//Gathering and console logging user input
    userNumber = $("#number-input").val().replace(/[\s+]/g, "");
    userNumber = userNumber.replace(/[-&\/\\#,+()$~%.'":*?<>{}@^_=|;]/g, "");
    console.log("===== User Number Entered: " + userNumber);

// Validating If/Else statement part 1: If user number enter is NaN(Not a number) show error.
    if (isNaN(userNumber)) {
      $("#number-info").empty();

      var $row = $('<tr>');

      $row.append($('<p>').text("Please enter a valid 10 digit domestic number"));

      $('#error-message').append($row);

// Validating If/Else statement part 2: If user number entered is a number with 10 digits, run usernumber into API calls.
  } else if (userNumber.length !== 10) {
      $("#number-info").empty();

      var $row = $('<tr>');

      $row.append($('<p>').text("Please enter a valid 10 digit domestic number"));

      $('#error-message').append($row);
  } else {
//Storing API keys and URLs and userNumber into new variables.
    var queryURLReverse = "https://proapi.whitepages.com/3.0/phone?phone=" + userNumber + "&api_key=" + reverseKey;
    var queryURLReputation = "https://proapi.whitepages.com/3.0/phone_reputation?phone=" + userNumber + "&api_key=" + reputationKey;

//Running both API calls to White Pages at one time inside of Axios, which is a Promise based, synchronous system.
    axios.all([axios.get(queryURLReverse), axios.get(queryURLReputation)])
      .then(axios.spread(function(revLookup, reputation) {
        reputation = writeReputationInfo(reputation);
        revLookup = writeReverseInfo(revLookup)

//Appending specific info needed from axios/API calls into a new variable. Then appening variable row to #number-info inside of DOM.
        var $row = $('<tr>');
        $row.append($('<td>').text(revLookup.person));
        $row.append($('<td>').text(revLookup.carrier));
        $row.append($('<td>').text(reputation.reputation));
        $row.append($('<td>').text(reputation.callType));
        $row.append($('<td>').text(revLookup.callLocation));
        $('#number-info').append($row);

//Pushing up specific to firebase
        database.ref().push({
          person: revLookup.person,
          carrier: revLookup.carrier,
          reputation: reputation.reputation,
          calltype: reputation.callType,
          usernumber: userNumber,
          callLocation: revLookup.callLocation,
          timeAdded: firebase.database.ServerValue.TIMESTAMP
        });//end of database push
    }))//end of axios .then
  }//end of else to run API calls
});//end of on click event

//Referencing firebase to add info to new variables when new child is added inside of database.
database.ref().on("child_added", function(childSnapshot){

    var person = childSnapshot.val().person;
    var carrier = childSnapshot.val().carrier;
    var reputation = childSnapshot.val().reputation;
    var calltype = childSnapshot.val().calltype;
    var usernumber = childSnapshot.val().usernumber;
    var callLocation = childSnapshot.val().callLocation;
    var timeAdded = childSnapshot.val().timeAdded;
      console.log(timeAdded);
    var date = moment(timeAdded).format('MMMM Do YYYY, h:mm:ss a');
      console.log(date);
        //prepend call info to safe or spam pages
        if (reputation >= "50%") {
        $('#spam-info').prepend("<tr><td>" + usernumber + "</td><td>" + person + "</td><td>" + carrier + "</td><td>" + reputation + "</td><td>" + calltype + "</td><td>" + callLocation + "</td><td>" + date + "</td>");
      } else {
        $('#safe-info').prepend("<tr><td>" + usernumber + "</td><td>" + person + "</td><td>" + carrier + "</td><td>" + reputation + "</td><td>" + calltype + "</td><td>" + callLocation + "</td><td>" + date + "</td>");
      }
    });//end of database childSnapshot

//create world map on load
function initMap() {
        var latlng = new google.maps.LatLng(0, 0);
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: latlng,
          mapTypeId: "hybrid"
        });
};
