//MORNING TODO: implement rooms as an object 

var Player = require("./Player.js");

var RoomProto = function (){
    this.roomCapacity = 8;
}

RoomProto.prototype.addPlayer = function (playerID) { //Add check for player, also the playerID -IS- the player nick, not a seperate ID
    if (this.players.length < this.roomCapacity && this.players[playerID] == null) {
        this.players.push(new Player(playerID));
        return true;
    }
    return false;
};

RoomProto.prototype.removePlayer = function (playerID) {
    for(var i = 0; i < this.players.length; i++){
        if(this.players[i].id == playerID){
            this.players.splice(i, 1);
            return true;
        }
    }
    return false;
};

var Room = function (id) {
    this.id = id;
    this.players = [];
    this.roomName = "Room " + id.toString();
    this.roomReady = false;
    this.roomMaster = null;
    //maybe add a gamestatus enum
}

Room.prototype = new RoomProto();
Room.prototype.constructor = Room;

module.exports = Room;
