/*jslint node: true */
"use strict";

var PORT = process.env.PORT || 3000;

/*Models and Services*/
var Room = require('./models/Room.js');
var PreGameServices = require('./services/pregame-services.js');
var PostGameServices = require('./services/postgame-services.js');
var GameServices = require('./services/game-services.js');
var RoomServices = require('./services/room-services.js');
var PlayerServices = require('./services/player-services.js');


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

server.listen(PORT, function () {
    console.log('And we are live on port %d', server.address().port);
});

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

var postGameServices = new PostGameServices({
    preGameService: preGameServices
});

var gameServices = new GameServices({
    io: io,
    events: {
        onGameOverUpdate: postGameServices.startNextGame
    }
});

var playerServices = new PlayerServices();
var roomServices = new RoomServices({
    io: io,
    playerList: playerServices.getPlayersList(),
    playerServices: playerServices
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.get('/debug', function (req, res) {
    res.json({
        roomsTotal: roomServices.getRooms().length,
        rooms: roomServices.getRooms(),
        playersTotal: Object.keys(playerServices.getPlayersList()).length,
        players: playerServices.getPlayersList()
    })
});

app.get('/getRoom/:id', function (req, res) {
    console.log(req.params.id);
    res.json(roomServices.getRooms()[req.params.id]);
});

io.sockets.on('connection', function (socket) {
    console.log('A socket connected!');
    console.log(socket.id);

    //-----------------------------------------------------------------------
    // Player
    //-----------------------------------------------------------------------
    socket.on('registerNickname', function(msg) { playerServices.registerNickname(msg, socket); });

    //-----------------------------------------------------------------------
    // Rooms
    //-----------------------------------------------------------------------
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

    //-----------------------------------------------------------------------
    // Games
    //-----------------------------------------------------------------------
    socket.on('player-update', function (data) {
        if(typeof playerServices.getPlayersList()[socket.id] !== 'undefined') {
            gameServices.processPlayerUpdate(data, socket.id, playerServices.getPlayersList());
        }
    });

    socket.on('game-player-ready', function(data) {
        var playersList = playerServices.getPlayersList();
        if(playersList[socket.id] != null){
            var playerID = playersList[socket.id].nickname;
            var roomID = playersList[socket.id].joinedRoom;
            preGameServices.setPlayerReady(roomServices.getRooms()[roomID], playerID);
        }
    });

    socket.on('start-game', function(data) {
        console.log('starting - game');
        preGameServices.startNextGame(roomServices.getRooms()[data.roomID]);
    });
});
