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
var reverseKey = "19a8f98d256c43c8b370ddf3a30130b9";
var reputationKey = "6112b420059f4d7c81cf99d5378dc961";
var mapsKey = "AIzaSyCsptyS96_W0OHNgvk792B6ASpVNdM6tqA";

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

}

function writeReverseInfo(object) {
    //Need an If/Else statement to provide placeholder name in the event that no name is available from API.
    console.log('vvvvvvvvvvvvvv');
    console.log(object);
    var person = "";
    var carrier = "";

    if (object.data.belongs_to.length) {
      person = object.data.belongs_to[0].firstname + ' ' + object.data.belongs_to[0].lastname;
    } else {
      person = "Not Available";
    }


    // var person = object.belongs_to[0].firstname + ' ' + object.belongs_to[0].lastname;
    var carrier = object.data.carrier;
    console.log("===== Caller: " + person);
    console.log("===== Carrier: " + carrier);
    var lat = object.data.current_addresses[0].lat_long.latitude;
    var lng = object.data.current_addresses[0].lat_long.longitude;
    console.log(lat);
    console.log(lng);

  //empy map div
  // $( "#map" ).empty();
  //Ready handler
  $(document).ready(function(){
    initMap();
  });

    function initMap() {
        var latlng = new google.maps.LatLng(lat, lng);
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 6,
          center: latlng
        });
        var marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
  }

  return {
    person: person,
    carrier: carrier
  }

}



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
        $('#number-info').append($row);
      }))
});
