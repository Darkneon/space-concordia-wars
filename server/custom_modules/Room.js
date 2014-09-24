var RomProto = function (){

}
RoomProto.prototype.addPlayer = function (playerID) { //Add check for player, also the playerID -IS- the player nick, not a seperate ID
    if (this.players.length < this.roomCapacity) {
        this.players.push(new Player(playerID));
        return true;
    }
    return false;
};

RoomProto.prototype.removePlayer = function (playerID) {
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

var Room = function (id) {
    this.id = id;
    this.roomCapacity = 8;
    this.players = [];
    //maybe add a gamestatus enum
}

Room.prototype = new RoomProto();
Room.prototype.constructor = Room;

module.exports = Room;
