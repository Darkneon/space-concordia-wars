/*jslint node: true */
//List game rooms
//new room
//music
//nick handling

"use strict";

var PORT = 3000;
var express  = require('express');
var socketio = require('socket.io');
var bodyParser = require('body-parser');

var id = 0;
var rooms = [];
//var players = [];


function Room(id) {
    this.id = id;
    this.roomCapacity = 8;
    this.players = [];
    //maybe add a gamestatus enum
}

function Player(nickname) {
    this.id = nickname;
    this.nickname = nickname
    this.team = 'red';
    this.score = -1;
}

Player.prototype.reset = function () {
    this.team = "";
    this.score = -1;
};

Player.prototype.switchTeams = function () {
    this.team = this.team === "red" ? "blue" : "red";
};

function updateGameList() {    
    console.log(rooms);
    io.sockets.emit(
        'refresh', 
        JSON.stringify(rooms.filter(function(room) {
            return room.players.length < room.roomCapacity; 
        }))
    );
}

//Perhaps create a prototype of room and pull up these methods
Room.prototype.addPlayer = function (playerID) {
    if (this.players.length < this.roomCapacity) {
        this.players.push(new Player(playerID));
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

app.get('/getRoom/:id', function (req, res) {
    res.json(rooms[req.params.id]);
});


app.post('/newRoom', function (req, res) {    
    id += 1; //temp
    rooms[id] = new Room(id);
    rooms[id].addPlayer(req.body.nickname);
    res.end(JSON.stringify(id));
    updateGameList();
   // io.sockets.emit('roomChanged', rooms[id].players);
});

app.post('/joinRoom', function (req, res) {
    var roomID = req.params.roomID;
    
    if (rooms.indexOf(roomID) > -1) {
        if (rooms[roomID].players.length < rooms[roomID].roomCapacity) {
            rooms[roomID].players.push(req.params.playerID);
            res.end("ok"); //do we need code numbers for errors?
            updateGameList();   
            
        } else {
            res.end(JSON.stringify({error: "Room is full"}));
        }
    } else {
        res.end(JSON.stringify({error: "Room not found"}));
    }
});

var server = app.listen(PORT, function () {
    console.log('And we are live on port %d', server.address().port);
});

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
    console.log('A socket connected!');        
    
    /*
    setTimeout(function() {
        console.log('playerJoined emitted');
        socket.emit('playerJoined', { name: 'New player', team : 'blue' });
    }, 100);
    */
    
    socket.on('changeTeam', function (msg) {
        console.log('changeTeam called');
        var roomID = msg; //?
        var playerID = msg; //?
        if (rooms.indexOf[roomID] <= -1) {
  //          socket
            socket.send(JSON.stringify({error: "Room not found"}));
        }
        
        if (rooms[roomID].players.indexOf[playerID] <= -1) {
            socket.send(JSON.stringify({error: "Player not found"}));
        }
        
        rooms[roomID].players[playerID].switchTeams();
        socket.emit('roomChanged', rooms[roomID].players);
    });
});
