//express
var express = require('express');
var app = express();
//path
var path = require('path');
//body parser and use with json data not encoded
var bodyParser = require("body-parser");
app.use(bodyParser.json());
//moment for timestamps
var moment = require("moment");
moment().format();
//set express static path to the client folder
app.use(express.static(path.join(__dirname, './client')));
//require mongoose to connect to mongo
require('./server/config/mongoose.js');
//require routes and pass in the app to routes
require('./server/config/routes.js')(app);
//listen for requests on the http port 8000
var server = app.listen(8000, function(){
    console.log('cool stuff on: 8000');
});
//set up sockets
var io = require('socket.io').listen(server);
var map = {};
var numOfUsers = 0;
io.sockets.on('connection', function(socket){
    console.log("The connection id is: " + socket.id);
    numOfUsers += 1;
    console.log("The total number of users is " + numOfUsers);
    var user = map['user'+numOfUsers] = {};
    socket.on('adding_user', function(data){
        user.name = data.name;
        user.socketID = socket.id;
        socket.emit('setting_socketUser', {name: user.name});
    })
    // how to listen for client side events
    //socket.on('event listener name', function(){})

    //how to respond to client side events
    //socket.emit('event name for client', {response: info}) --> goes to only socket that is connected
    //socket.broadcast.emit('event name for clients', {response: info}) --> goes to all other socket connections
    //io.emit('event name for all clients', {response: info}) --> goes to all socket connections

    //listening for the client disconnect event
    socket.on('disconnect', function(){
        console.log(socket.id + " is now disconnnected");
        numOfUsers -= 1;
        console.log("The total number of users is " + numOfUsers);
    })
})
