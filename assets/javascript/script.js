//---------------------------------------------------------------------------
// VARIABLE DECLARATIONS!

// Initialize Firebase
var config = {
	apiKey: "AIzaSyAb6Aa0FeF6yAqjGqVqjGmGJ-kzl8SmsKU",
	authDomain: "train-schedule-6c731.firebaseapp.com",
	databaseURL: "https://train-schedule-6c731.firebaseio.com",
	projectId: "train-schedule-6c731",
	storageBucket: "train-schedule-6c731.appspot.com",
	messagingSenderId: "663388181090"
};

firebase.initializeApp(config);

var database = firebase.database();

//---------------------------------------------------------------------------
// FUNCTION DECLARATIONS!

function saveUserInput() {
	var trainName = $("#train-name-input").val().trim();
	var trainDestination = $("#destination-input").val().trim();
	var firstTrain = $("#first-train-time-input").val().trim();
	var trainFrequency = $("#frequency-input").val().trim();

	var newTrain = {
		trainName: trainName,
		destination: trainDestination,
		firstTrain: firstTrain,
		frequency: trainFrequency
	};

	database.ref().push(newTrain);

	console.log(newTrain.trainName);
	console.log(newTrain.destination);
	console.log(newTrain.firstTrain);
	console.log(newTrain.frequency);

	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-train-time-input").val("");
	$("#frequency-input").val("");
}

//---------------------------------------------------------------------------
// ACTUAL FUNCTIONAL BITS!

// When the document is ready
$(document).ready(function() {

$("#submit-button").on("click", function(event) {
	event.preventDefault();
	saveUserInput();
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	// console.log(childSnapshot.val());

	var trainName = childSnapshot.val().trainName;
	var trainDestination = childSnapshot.val().destination;
	var firstTrain = childSnapshot.val().firstTrain;
	var trainFrequency = childSnapshot.val().frequency;

	// console.log(trainName);
	// console.log(trainDestination);
	// console.log(firstTrain);
	// console.log(trainFrequency);

	var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
	// console.log(firstTimeConverted);

	var currentTime = moment();
	// console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	// console.log("DIFFERENCE IN TIME: " + diffTime);

	var tRemainder = diffTime % trainFrequency;
	// console.log(tRemainder);

	// Minute Until Train
	var tMinutesTillTrain = trainFrequency - tRemainder;
	// console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	// console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

	// Add each train's data into the table
	$("#train-schedule > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>Every " +
	trainFrequency + " minutes</td><td>" + moment(nextTrain).format("LT") + "</td><td>" + tMinutesTillTrain + " minutes</td></tr>");

});

// End of document.ready function
});
