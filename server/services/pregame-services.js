//waiting for players to load

var PreGameService = function(options) {
    var NOOP = function() {};
    options = options || {};
    options.events = options.events || {};

    this.events = {
        onPlayerReadySend: options.events.onPlayerReadySend || NOOP,
        onAllPlayersReadySend: options.events.onAllPlayersReadySend || NOOP
    };
};

PreGameService.prototype.setPlayerReady = function(room, playerId) {
    room.players[playerId].isReady = true;
    this.events.onPlayerReadySend(null, room, playerId);
    if(room.allPlayersReady()) {
        this.events.onAllPlayersReadySend(null, room);
    }
};

module.exports = PreGameService;