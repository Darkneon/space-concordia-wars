/*jslint node: true */
"use strict";

/*Goal for today:
Make a pull request for:
1. Someone starting a server (post)
2. Someone requesting a list of games available (get)
*/

var express  = require('express');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
//var uuid = require('node-uuid');

var id = 0;
var rooms = [];

/*
function Player(){
}
*/

function Room(id){
    this.id = id;
    this.password = "";
    this.passwordEnabled = false;
    this.roomCapacity = 2;
    this.players = [];
}

//Perhaps create a prototype of room and pull up these methods
Room.prototype.addPlayer = function(playerID){
    if(this.players.length < this.roomCapacity){
        this.players.append(playerID);
        return true;
    }
    return false;
}

Room.prototype.removePlayer = function(playerID){
    var index = this.players.indexOf(playerID)
    if(index > -1){
        this.players.splice(index, 1);
        return true;
    }
    return false;
}

var app = express();

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded());

app.get('/', function (req, res) {
    res.sendFile( __dirname + '/client/index.html' );
});

app.post('/newRoom', function (req, res) {
    id += 1; //temp
    rooms[id] = new Room(id);
    rooms[id].addPlayer(client.id);
    res.send(id);
});

var server = app.listen(3000, function() {
    console.log('And we are live on port %d', server.address().port);
});

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
    console.log('A socket connected!');
});