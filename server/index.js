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
    debugger;
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
Room.prototype.addPlayer = function (playerID) { //Add check for player, also the playerID -IS- the player nick, not a seperate ID
    if (this.players.length < this.roomCapacity) {
        this.players.push(new Player(playerID));
        return true;
    }
    return false;
};

Room.prototype.removePlayer = function (playerID) {
   // if (this.players[playerID] != null) {
   //     delete this.players[playerID];
   //     return true;
   // }
    
    for(var i = 0; i < this.players.length; i++){ //temporary implementation
        if(this.players[i].id == playerID){
            this.players.splice(i, 1);
            return true;
        }
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


app.post('/newRoom', function (req, res) {    
    id += 1; //temp
    rooms[id] = new Room(id);
   // io.socket.join(id.toString());
    
    rooms[id].addPlayer(req.body.nickname);
    res.end(JSON.stringify(id));
    updateGameList();
   // io.sockets.emit('roomChanged', rooms[id].players);
});

app.post('/joinRoom', function (req, res) {
    var roomID = parseInt(req.body.roomID, 10);
    var nickname = req.body.nickname;
    if(isValidNickname(nickname)){
        //playerList[socket.id] = new PlayerRecord(socket.id, nickname);
        if (rooms[roomID]) {
            if (rooms[roomID].players.length < rooms[roomID].roomCapacity) {
                //socket.join(roomID.toString());
                rooms[roomID].addPlayer(nickname);
                res.end("ok"); //do we need code numbers for errors?
                updateGameList();

            } else {
                res.end(JSON.stringify({error: "Room is full"}));
            }
        } else {
            res.end(JSON.stringify({error: "Room not found"}));
        }
    } else {
        res.end(JSON.stringify({error: "Nick in use"}));
    }
});

app.post('/leaveRoom', function(req, res){
    var roomID = req.params.roomID;
    var playerID = req.params.playerID;
    
    rooms[roomID].removePlayer(playerID);
    
    if(rooms[roomID].players.length == 0) {
        rooms.splice(roomID, 1);
    }
    
    delete playerList[socket.id];
    //socket.leave(roomID.toString());
});

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
            playerList[socket.id].joinedRoom = roomID;
            
            console.log("roomCreated");
            socket.join(roomID.toString());
            socket.emit("roomCreated", JSON.stringify(roomID));
            updateGameList();
        }
        else {
            socket.emit("invalidNick");
        }
    });
    /*
    socket.on('joinRoom', function(msg){
    });
    
    socket.on('getRoom', function(msg){
    });
    
    socket.on('getAllRooms', function(msg){
    });
    
    socket.on('leaveRoom', function (msg) {
        var roomID = msg.roomID;
        var playerID = msg.playerID;
        rooms[roomID].removePlayer(playerID); 
        
        if(rooms[roomID].players.length == 0) {
            rooms[roomID] = null;
        }
        socket.leave(roomID.toString());
    });
    */
    
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
        //console.log("Someone has disconnected");
        //console.log(socket.id);
        if(playerList[socket.id] != null){
            if(playerList[socket.id].joinedRoom != null){
                var roomID = playerList[socket.id].joinedRoom;
                //console.log(roomID);
                rooms[roomID].removePlayer(playerList[socket.id].nickname);
               // console.log(rooms[roomID].players);
               // console.log(rooms[roomID].players.length);
            
                if(rooms[roomID].players.length == 0) {
                    rooms.splice(roomID, 1); //TODO: find an efficient way to remove empty values
                    updateGameList();
                }
            }
            delete playerList[socket.id];
        }
    });
    
});
