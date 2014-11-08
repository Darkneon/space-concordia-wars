//waiting for players to load
var IridescenceServices = require('./games/iridescence-services.js');
//var iridescenceServices = new IridescenceServices();

var PreGameService = function(options) {
    var NOOP = function() {};
    options = options || {};
    options.events = options.events || {};


    //this.socket = options.socket;
    this.io = options.io;

    this.events = {
        onPlayerReadySend: options.events.onPlayerReadySend || NOOP,
        onAllPlayersReadySend: options.events.onAllPlayersReadySend || NOOP,
        onGameOverOrGameStart: options.events.onSend || NOOP
    };
};

PreGameService.prototype.setPlayerReady = function(room, playerId) {
    room.players[playerId].isReady = true;
    this.events.onPlayerReadySend(null, room, playerId);
    if(room.allPlayersReady()) {
        this.events.onAllPlayersReadySend(null, room);
    }
};

PreGameService.prototype.startNextGame = function(room) {
    var game = room.getNextGame();
    if (game) {
        var gamedata = {};
        if(game == 'iridescence'){
            gamedata.extra = IridescenceServices.generatePlatforms();
        }
        else {
            gamedata.extra = null;
        }
        gamedata.currentGame = game;
        console.log('load-game');
        this.io.to(room.id).emit('load-game', gamedata);
    }
    // else to some logging
}

module.exports = PreGameService;