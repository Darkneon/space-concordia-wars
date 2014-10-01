var Player = require("./Player.js");

var Room = function (id) {
    this.id = id;
    this.players = {};
    this.roomName = "Room " + id.toString();
    this.roomReady = false;
    this.roomMaster = null;
    this.roomCapacity = 8;
    this.numOfJoinedPlayers = 0;
    //maybe add a gamestatus enum
}

Room.prototype.addPlayer = function (playerID) { //Add check for player, also the playerID -IS- the player nick, not a seperate ID
    if (this.numOfJoinedPlayers <= this.roomCapacity && this.players[playerID] == null) {
        this.players[playerID] = new Player(playerID);
        this.numOfJoinedPlayers += 1;
        return true;
    }
    return false;
};

Room.prototype.removePlayer = function (playerID) {
    if(this.players[playerID] != null){
        delete this.players[playerID];
        this.numOfJoinedPlayers -= 1;
        return true;
    }
    return false;
};

Room.prototype.allPlayersReady = function () {
    for(var playerID in this.players){
        if(this.players.hasOwnProperty(playerID)){
            if(this.players[playerID].isReady === false) {
                return false;
            }
        }
    }
    return true;
}

module.exports = Room;
