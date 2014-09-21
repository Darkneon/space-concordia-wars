/*jslint node: true */
"use strict";

var PORT = 3000;
var express  = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.urlencoded());


server.listen(PORT, function() {
    console.log('And we are live on port %d', server.address().port);
});

var id = 0;
var rooms = [];
var playerList = [];

function isValidNickname(name) {
    console.log(name);
    console.log(playerList);
    if(name.trim() != "") {
        for(var recordID in playerList){ //not an efficient solution but the number of expected users is very small.
            if(playerList.hasOwnProperty(recordID)) {
                if (playerList[recordID].nickname == name) {
                    return false;
                }
            }
        }
        
        return true;
    }
    return false;
}

function updateGameList() {
    console.log(rooms);
    io.sockets.emit(
        'refresh',
        JSON.stringify(rooms.filter(function (room) {
            return room.players.length < room.roomCapacity;
        }))
    );
}

function Room(id) {
    this.id = id;
    this.roomCapacity = 8;
    this.players = [];
    //maybe add a gamestatus enum
}

function PlayerRecord(id, nickname) {
    this.id = id;
    this.nickname = nickname;
    this.joinedRoom = null;
}

function Player(nickname) {
    this.id = nickname;
    this.nickname = nickname;
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


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// REST
app.get('/room', function (req, res) {
    res.json(rooms);
});

app.get('/getRoom/:id', function (req, res) {
    console.log(req.params.id);
    res.json(rooms[req.params.id]);
});


/*
app.post('/newRoom', function (req, res) {    
    id += 1; //temp
    rooms[id] = new Room(id);
   // io.socket.join(id.toString());
    
    rooms[id].addPlayer(req.body.nickname);
    res.end(JSON.stringify(id));
    updateGameList();
   // io.sockets.emit('roomChanged', rooms[id].players);
});
*/

app.post('/joinRoom', function (req, res) {
    var roomID = parseInt(req.body.roomID, 10);
    if (rooms[roomID]) {
        if (rooms[roomID].players.length < rooms[roomID].roomCapacity) {
            //socket.join(roomID.toString());
            rooms[roomID].addPlayer(req.body.playerID);
            res.end("ok"); //do we need code numbers for errors?
            updateGameList();
            
        } else {
            res.end(JSON.stringify({error: "Room is full"}));
        }
    } else {
        res.end(JSON.stringify({error: "Room not found"}));
    }
});

app.post('/leaveRoom', function(req, res){
    var roomID = req.params.roomID;
    var playerID = req.params.playerID;
    
    rooms[roomID].removePlayer(playerID); 
    if(rooms[roomID].players.length == 0) {
        rooms[roomID] = null;
    }
    socket.leave(roomID.toString());
});

//var server = app.listen(PORT, function () {
//    console.log('And we are live on port %d', server.address().port);
//});


io.sockets.on('connection', function (socket) {
    console.log('A socket connected!');
    console.log(socket.id);
    
    socket.on('newRoom', function(msg) {
        console.log("newRoom called");
        var playerNick = msg.nickname;
        
        if(isValidNickname(playerNick)) {
            var roomID = id;
            id += 1;
            playerList[socket.id] = new PlayerRecord(socket.id, playerNick);
            rooms[roomID] = new Room(roomID);
            rooms[roomID].addPlayer(playerNick);
            
            console.log("roomCreated");
            socket.join(roomID.toString());
            socket.emit("roomCreated", JSON.stringify(roomID));
            updateGameList();
        }
        else {
            socket.emit("invalidNick");
        }
    });
    
    socket.on('changeTeam', function (msg) {
        console.log('changeTeam called');
        var roomID = parseInt(msg.roomID, 10);
        var playerID = msg.playerID;
        
        if (!rooms[roomID]) {
  //          socket
            socket.send(JSON.stringify({error: "Room not found"}));
        }

        var player = rooms[roomID].players.filter(function(player) {
            return player.nickname === playerID;
        })[0];
        if (!player) {
            socket.send(JSON.stringify({error: "Player not found"}));
        }
        
        player.switchTeams();
        io.to(roomID.toString).emit('roomChanged', rooms[roomID].players);
    });
    
    socket.on('disconnect', function () {
       /* var playerIdIndex = playerList.map (function (player) {return player.id; }).indexOf(socket.id);
        if(playerIdIndex > -1){
            if(playerList[playerIdIndex].joinedRoom != null){
                var roomID = playerList[playerIdIndex].joinedRoom;
                rooms[roomID].removePlayer(playerIdIndex);
                if(rooms[roomID].players.length == 0) {
                    delete rooms[roomID];
                    updateGameList();
                }
            }
            */
        if(playerList[socket.id] != null){
            if(playerList[socket.id].joinedRoom != null){
                var roomID = playerList[socket.id].joinedRoom;
                rooms[roomID].removePlayer(playerIdIndex);
            
                if(rooms[roomID].players.length == 0) {
                    delete rooms[roomID];
                    updateGameList();
                }
                delete playerList[socket.id];
            }
        }
    });
});

