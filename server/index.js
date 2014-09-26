/*jslint node: true */
"use strict";

var PORT = 3000;
var Room = require('./custom_modules/Room.js');
var express  = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.urlencoded());


server.listen(PORT, function () {
    console.log('And we are live on port %d', server.address().port);
});

var id = 0;
var rooms = [];
var playerList = {};

function isValidNickname(name) {
    console.log(name);
    console.log(playerList);
    if (name.trim() !== "") {
        for (var recordID in playerList) { //not an efficient solution but the number of expected users is very small.
            if (playerList.hasOwnProperty(recordID)) {
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
    rooms.forEach(function(room){console.log(room.players)});
    io.sockets.emit(
        'refresh',
        JSON.stringify(rooms.filter(function (room) {
            return room.players.length < room.roomCapacity;
        }))
    );
}

function PlayerRecord(id, nickname) {
    this.id = id;
    this.nickname = nickname;
    this.joinedRoom = null;
}

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// Leaving the app.get methods here for now for compatibility
app.get('/room', function (req, res) {
    res.json(rooms);
});

app.get('/getRoom/:id', function (req, res) {
    console.log(req.params.id);
    res.json(rooms[req.params.id]);
});

io.sockets.on('connection', function (socket) {
    console.log('A socket connected!');
    console.log(socket.id);
    
    socket.on('newRoom', function(msg) {
        var playerNick = msg.nickname;
        
        if(isValidNickname(playerNick)) {
            console.log(playerNick, 'newRoom');
            var roomID = id;
            id += 1;
            playerList[socket.id] = new PlayerRecord(socket.id, playerNick);
            
            rooms[roomID] = new Room(roomID);
            rooms[roomID].addPlayer(playerNick);
            playerList[socket.id].joinedRoom = roomID;
            
            socket.join(roomID);
            console.log(roomID);
            socket.emit("roomCreated", roomID);
            updateGameList();
        }
        else {
            socket.emit("invalidNick");
        }
    });
    
    //TODO: update client code to use sockets and test out this code
    
    socket.on('joinRoom', function(msg){
        //var msg = JSON.parse(msg);
        console.log('joinRoom', msg);

        var roomID = parseInt(msg.roomID, 10);
        var nickname = msg.playerID;
        if(isValidNickname(nickname)){
            playerList[socket.id] = new PlayerRecord(socket.id, nickname);

            console.log(nickname, 'joined');
            if (rooms[roomID]) {
                if (rooms[roomID].players.length < rooms[roomID].roomCapacity) {
                    socket.join(roomID);
                    playerList[socket.id].joinedRoom = roomID;
                    rooms[roomID].addPlayer(nickname);
                    socket.emit("roomJoined", msg); //What kind of confirmation method should we use?
                    io.to(roomID).emit('roomChanged', rooms[roomID].players);
                    updateGameList();

                } else {
                    socket.emit("joinError", {error: "Room is full"});
                }
            } else {
                socket.emit("joinError", {error: "Room not found"});
            }
        } else {
            socket.emit("joinError", {error: "Nick in use"});
        }
    });
    
    socket.on('getRoom', function(msg){
        var roomID = parseInt(msg.id, 10); //TODO: change client code to send .roomID instead of just .id
        socket.emit('room', rooms[roomID]);
    });
    
    socket.on('getAllRooms', function(msg){
        socket.emit('allRooms', rooms);
    });
    
    socket.on('leaveRoom', function (msg) {
        var roomID = parseInt(msg.roomID, 10);
        var playerID = msg.playerID;
        rooms[roomID].removePlayer(playerID); 
        
        if(rooms[roomID].players.length == 0) {
            rooms.splice(roomID, 1);
            updateGameList();
        } else {
            io.to(roomID).emit('roomChanged', rooms[roomID].players);
        }
        socket.leave(roomID);
    });
    
    
    socket.on('changeTeam', function (msg) {
        console.log('changeTeam called');
        var roomID = parseInt(msg.roomID, 10);
        var playerID = msg.playerID;
        
        if (!rooms[roomID]) {
            socket.emit("error", {error: "Room not found"});
        }

        var player = rooms[roomID].players.filter(function(player) {
            return player.nickname === playerID;
        })[0];
        if (!player) {
            socket.send(JSON.stringify({error: "Player not found"}));
        }
        
        player.switchTeams();
        io.to(roomID).emit('roomChanged', rooms[roomID].players);
    });
    
    
    socket.on('disconnect', function () {

        console.log("Someone has disconnected");
        console.log(socket.id);

        if(playerList[socket.id] != null){
            if(playerList[socket.id].joinedRoom != null){
                var roomID = playerList[socket.id].joinedRoom;
                rooms[roomID].removePlayer(playerList[socket.id].nickname);
            
                if(rooms[roomID].players.length == 0) {
                    rooms.splice(roomID, 1); //TODO: find an efficient way to remove empty values
                    updateGameList();
                } else {
                    io.to(roomID).emit('roomChanged', rooms[roomID].players); //This will probably have to be expanded on once the games are actually integrated
                }
            }
            delete playerList[socket.id];
        }
    });

    socket.on('player-update', function (data) {
        if(typeof playerList[socket.id] !== 'undefined') {
            playerList[socket.id].data = playerList[socket.id].data || {};
            playerList[socket.id].data.score = data.score;
            playerList[socket.id].data.highestJump = data.highestJump;
            playerList[socket.id].data.status = data.status;

            var allDead = 0;

            for (var key in playerList) {
                var player = playerList[key];
                console.log('f', player);
                if (player.data && player.data.status === 'dead') {
                    allDead += 1;
                }
            }

            if (allDead === Object.keys(playerList).length) {
                io.emit('game-over-update', {highestJump: 'player1'});
            }

        }
    });
});
