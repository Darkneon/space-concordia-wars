/*jslint node: true */
"use strict";

var PORT = 3000;

/*Models and Services*/
var Room = require('./models/Room.js');
var PreGameServices = require('./services/pregame-services.js');
var GameServices = require('./services/game-services.js');
var RoomServices = require('./services/room-services.js');


/*Modules*/
var express  = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var assert = require('assert');

app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.urlencoded());

var preGameServices = new PreGameServices({
    events: {
        onPlayerReadySend: function (error, room, playerID) {
            io.to(room.id).emit('game-player-ready-update', roomServices.getRooms()[room.id].players[playerID].nickname);
        },

        onAllPlayersReadySend: function(error, room){
            io.to(room.id).emit('game-start');
        }
    },
    io: io
});


server.listen(PORT, function () {
    console.log('And we are live on port %d', server.address().port);
});

var playerList = {};

var gameServices = new GameServices({ io: io });
var roomServices = new RoomServices({ io: io, playerList: playerList });

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// Leaving the app.get methods here for now for compatibility
app.get('/room', function (req, res) {
    res.json(roomServices.getRooms());
});


app.get('/getRooms', function (req, res) {
    res.json(roomServices.getRooms());
});


app.get('/getRoom/:id', function (req, res) {
    console.log(req.params.id);
    res.json(roomServices.getRooms()[req.params.id]);
});

io.sockets.on('connection', function (socket) {
    console.log('A socket connected!');
    console.log(socket.id);
    
    socket.on('newRoom', function(msg) { roomServices.newRoom(msg, socket); });
    //TODO: update client code to use sockets and test out this code
    socket.on('joinRoom', function(msg) { roomServices.joinRoom(msg, socket); });
    socket.on('getRoom', function(msg){
        var roomID = parseInt(msg.id, 10); //TODO: change client code to send .roomID instead of just .id
        socket.emit('room', roomServices.getRooms()[roomID]);
    });
    socket.on('getAllRooms', function()  { socket.emit('allRooms', roomServices.getRooms()); });
    socket.on('leaveRoom', function(msg){ roomServices.leaveRoom(msg, socket); });
    socket.on('changeTeam', function(msg) { roomServices.changeTeam(msg, socket); });
    socket.on('disconnect', function() { roomServices.disconnect(socket); });

    socket.on('player-update', function (data) {
        if(typeof playerList[socket.id] !== 'undefined') {
            gameServices.processPlayerUpdate(data, socket.id, playerList);
        }
    });

    socket.on('get-iri-level', function(data) {
       gameServices.generateLevels();
    });

    socket.on('game-player-ready', function(data) {
        if(playerList[socket.id] != null){
            var playerID = playerList[socket.id].nickname;
            var roomID = playerList[socket.id].joinedRoom;
            preGameServices.setPlayerReady(roomServices.getRooms()[roomID], playerID);
        }
    });

    socket.on('start-game', function(data) {
        console.log('starting - game');
        preGameServices.startNextGame(roomServices.getRooms()[data.roomID]);
    });
});
