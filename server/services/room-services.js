var assert = require('assert');
var Player = require('../models/Player.js');
var Room = require('../models/Room.js');

var RoomServices = function(options) {
    assert(options.playerServices, 'PlayerService was not passed');

    this.playerList = options.playerList;
    this.id = 0;
    this.rooms = [];
    this.io = options.io;
    this.playerServices = options.playerServices;
};

RoomServices.prototype.getRooms = function() {
    return this.rooms;
};

RoomServices.prototype.newRoom = function(msg, socket) {
    var playerNick = msg.nickname;

    console.log(playerNick, 'newRoom');
    var roomID = this.id;
    var socketId = socket.id;
    var playerList = this.playerList;
    this.id += 1;
    playerList[socketId] = new Player(socket.id, playerNick);
    playerList[socketId].team = 'red';

    this.rooms[roomID] = new Room(roomID);
    this.rooms[roomID].addPlayer(playerList[socketId]);
    playerList[socketId].joinedRoom = roomID;

    socket.join(roomID);
    socket.emit("roomCreated", roomID);
    updateGameList.call(this);
};

RoomServices.prototype.joinRoom = function(msg, socket) {
    var roomID = parseInt(msg.roomID, 10);
    var nickname = msg.playerID;
    var playerList = this.playerList;
    var rooms = this.rooms;

    playerList[socket.id] = new Player(socket.id, nickname);

    if (rooms[roomID]) {
        if (rooms[roomID].numOfJoinedPlayers < rooms[roomID].roomCapacity) {
            socket.join(roomID);
            playerList[socket.id].joinedRoom = roomID;
            playerList[socket.id].team = rooms[roomID].numOfJoinedPlayers % 2 === 0 ? 'red' : 'blue';
            rooms[roomID].addPlayer( playerList[socket.id]);
            socket.emit("roomJoined", msg); //What kind of confirmation method should we use?
            this.io.to(roomID).emit('roomChanged', rooms[roomID].players);
            updateGameList.call(this);

        } else {
            socket.emit("joinError", {error: "Room is full"});
        }
    } else {
        socket.emit("joinError", {error: "Room not found"});
    }
};

RoomServices.prototype.changeTeam = function(msg, socket) {
    var rooms = this.rooms;
    var roomID = parseInt(msg.roomID, 10);

    if (!rooms[roomID]) {
        socket.emit("error", {error: "Room not found"});
    }

    var player = rooms[roomID].players[socket.id] || null;
    if (!player) {
        socket.send(JSON.stringify({error: "Player not found"}));
    }

    player.switchTeams();
    this.io.to(roomID).emit('roomChanged', rooms[roomID].players);
};

RoomServices.prototype.leaveRoom = function (msg, socket) {
    var rooms = this.rooms;
    var roomID = parseInt(msg.roomID, 10);
    var playerID = msg.playerID;
    rooms[roomID].removePlayer(playerID);

    if(rooms[roomID].numOfJoinedPlayers == 0) {
        rooms.splice(roomID, 1);
        updateGameList.call(this);
    } else {
        this.io.to(roomID).emit('roomChanged', rooms[roomID].players);
    }
    socket.leave(roomID);
};

RoomServices.prototype.disconnect = function(socket) {
    var playerList = this.playerList;
    var rooms = this.rooms;

    console.log("Someone has disconnected");
    console.log(socket.id);

    if(playerList[socket.id] != null){
        if(playerList[socket.id].joinedRoom != null){
            var roomID = playerList[socket.id].joinedRoom;
            rooms[roomID].removePlayer(playerList[socket.id]);

            if(rooms[roomID].numOfJoinedPlayers == 0) {
                rooms.splice(roomID, 1); //TODO: find an efficient way to remove empty values
                updateGameList.call(this);
            } else {
                this.io.to(roomID).emit('roomChanged', rooms[roomID].players); //This will probably have to be expanded on once the games are actually integrated
            }
        }
        delete playerList[socket.id];
    }
};

function updateGameList() {
    this.io.sockets.emit(
        'refresh',
        JSON.stringify(this.rooms.filter(function (room) {
            return room.numOfJoinedPlayers < room.roomCapacity;
        }))
    );
}

module.exports = RoomServices;
