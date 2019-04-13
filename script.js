// Initialize Firebase
var config = {
    apiKey: "AIzaSyBP7YGG1rrCkjM2te73UDOjUueQRLS8L5A",
    authDomain: "skillshare-31ac6.firebaseapp.com",
    databaseURL: "https://skillshare-31ac6.firebaseio.com",
    projectId: "skillshare-31ac6",
    storageBucket: "skillshare-31ac6.appspot.com",
    messagingSenderId: "889703548824"
  };
  firebase.initializeApp(config);

var database = firebase.database();

console.log(database.ref().child("first"));

$("#current-time").append(moment().format('MMMM Do YYYY, h:mm:ss a'));


$("#addTrain").on("click", function(event){
    event.preventDefault();

    var trainName = $("#trainNameForm").val().trim();
    var destinationName = $("#destinationForm").val().trim();
    var firstTrainTime = $("#firstTrainForm").val().trim();
    var frequency = $("#frequencyForm").val().trim();
    
    // var nextArrival = moment(firstTrainTime).add(frequency, 'minutes')


    database.ref().push({
        fbTrainName: trainName,
        fbDestinationName: destinationName,
        fbFirstTrainTime: firstTrainTime,
        fbFrequency: frequency,
        // fbNextArrival: nextArrival
    });
    $("#trainNameForm").val("")
    $("#destinationForm").val("")
    $("#firstTrainForm").val("")
    $("#frequencyForm").val("")
});

database.ref().on("child_added", function(snapshot){
    var snap = snapshot.val();
    var tFrequency = snap.fbFrequency;
    var firstTrainTime = snap.fbFirstTrainTime;

    var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTrainTimeConverted);

    var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var trainRow = $("<tr>");
    trainRow.append("<th scope = 'row'>" + snap.fbTrainName + "</th>");
    trainRow.append("<th scope = 'row'>" + snap.fbDestinationName + "</th>");
    trainRow.append("<th scope = 'row'>" + snap.fbFirstTrainTime + "</th>");
    trainRow.append("<th scope = 'row'>" + snap.fbFrequency + "</th>");
    trainRow.append("<th scope = 'row'>" + nextTrain.format("hh:mm") + "</th>");
    trainRow.append("<th scope = 'row'>" + tMinutesTillTrain + "</th>");
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // trainRow.append("<th scope = 'row'>" + snap.fbNextArrival + "</th>")

    $("#trainTable").append(trainRow);
});
