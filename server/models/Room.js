//MORNING TODO: implement rooms as an object 

var Player = require("./Player.js");

var Room = function (id) {
    this.id = id;
    this.players = [];
    this.roomName = "Room " + id.toString();
    this.roomReady = false;
    this.roomMaster = null;
    this.roomCapacity = 8;
    //maybe add a gamestatus enum
}

Room.prototype.allPlayersReady = function() {
   return this.players.every(function (player) {
       return player.isReady;
   });
};

Room.prototype.addPlayer = function (playerID) { //Add check for player, also the playerID -IS- the player nick, not a seperate ID
    if (this.players.length < this.roomCapacity && this.players[playerID] == null) {
        this.players.push(new Player(playerID));
        return true;
    }
    return false;
};

Room.prototype.removePlayer = function (playerID) {
    for(var i = 0; i < this.players.length; i++){
        if(this.players[i].id == playerID){
            this.players.splice(i, 1);
            return true;
        }
    }
    return false;
};

module.exports = Room;
