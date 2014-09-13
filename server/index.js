/*jslint node: true */
//List game rooms
//music
//new room

"use strict";

var express  = require('express');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
//var uuid = require('node-uuid');

var id = 0;
var rooms = [];


function Room(id) {
    this.id = id;
    this.roomCapacity = 8;
    this.players = [];
}

//Perhaps create a prototype of room and pull up these methods
Room.prototype.addPlayer = function (playerID) {
    if (this.players.length < this.roomCapacity) {
        this.players.push(playerID);
        return true;
    }
    return false;
};

Room.prototype.removePlayer = function (playerID) {
    var index = this.players.indexOf(playerID);
    if (index > -1) {
        this.players.splice(index, 1);
        return true;
    }
    return false;
};

var app = express();

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/getRooms', function (req, res) {
    res.end(JSON.stringify(rooms));
});

app.post('/newRoom', function (req, res) {
    id += 1; //temp
    rooms[id] = new Room(id);
    rooms[id].addPlayer(req.params.id);
    res.end(JSON.stringify(id));
});

var server = app.listen(3000, function () {
    console.log('And we are live on port %d', server.address().port);
});

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
    console.log('A socket connected!');
});

