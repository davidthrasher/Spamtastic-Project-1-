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
var reverseKey = "19a8f98d256c43c8b370ddf3a30130b9";
var reputationKey = "6112b420059f4d7c81cf99d5378dc961";
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
    event.preventDefault();

    $("#number-info").empty();

    userNumber = $("#number-input").val().trim();

    var queryURLReverse = "https://proapi.whitepages.com/3.0/phone?phone=" + userNumber + "&api_key=" + reverseKey;
    var queryURLReputation = "https://proapi.whitepages.com/3.0/phone_reputation?phone=" + userNumber + "&api_key=" + reputationKey;

    axios.all([axios.get(queryURLReverse), axios.get(queryURLReputation)])
      .then(axios.spread(function(revLookup, reputation) {
        reputation = writeReputationInfo(reputation);
        revLookup = writeReverseInfo(revLookup)

        var $row = $('<tr>');
        $row.append($('<td>').text(revLookup.person));
        $row.append($('<td>').text(revLookup.carrier));
        $row.append($('<td>').text(reputation.reputation));
        $row.append($('<td>').text(reputation.callType));
        $row.append($('<td>').text(revLookup.callLocation));
        $('#number-info').append($row);

        database.ref().push({
          person: revLookup.person,
          carrier: revLookup.carrier,
          reputation: reputation.reputation,
          calltype: reputation.callType,
          usernumber: userNumber,
          callLocation: revLookup.callLocation
        });//end of database push
    }))//end of axios .then
});//end of on click event

database.ref().on("child_added", function(childSnapshot){

    var person = childSnapshot.val().person;
    var carrier = childSnapshot.val().carrier;
    var reputation = childSnapshot.val().reputation;
    var calltype = childSnapshot.val().calltype;
    var usernumber = childSnapshot.val().usernumber;
    var callLocation = childSnapshot.val().callLocation;

        //prepend call info to safe or spam pages
        if (reputation >= "50%") {
        $('#spam-info').prepend("<tr><td>" + usernumber + "</td><td>" + person + "</td><td>" + carrier + "</td><td>" + reputation + "</td><td>" + calltype + "</td><td>" + callLocation + "</td>");
      } else {
        $('#safe-info').prepend("<tr><td>" + usernumber + "</td><td>" + person + "</td><td>" + carrier + "</td><td>" + reputation + "</td><td>" + calltype + "</td><td>" + callLocation + "</td>");
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
}