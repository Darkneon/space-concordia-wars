var GameServices = function(options) {
    var NOOP = function() {};
    options = options || {};
    options.events = options.events || {};
    this.iridescenceManager = require('./games/iridescence-services.js');



   // this.socket = options.socket;
    this.io = options.io;

  //  this.events = {
  //      onPlayerReadySend: options.events.onPlayerReadySend || NOOP,
  //      onAllPlayersReadySend: options.events.onAllPlayersReadySend || NOOP,
  //      onGameOverOrGameStart: options.events.onSend || NOOP
  //  };
};

GameServices.prototype.setIridescenceLevel = function(room) {
    if(!room.iridescenceLevel) {
        room.iridescenceLevel = this.iridescenceManager.generateLevels();
    }
    this.io.to(room.id).emit({levels: room});
};

GameServices.prototype.processPlayerUpdate = function(data, playerId, playerList) {
    var data = this.iridescenceManager.processPlayerUpdate(data, playerId, playerList);

    var allDead = 0;

    for (var key in playerList) {
        var player = playerList[key];
        if (player.data && player.data.status === 'dead') {
            allDead += 1;
        }
    }


    if (data) {
        if (allDead === Object.keys(playerList).length) {
            this.io.emit('game-over-update', {
                highestJump: 'player1',
                redScore: data.redScore,
                blueScore: data.blueScore
            });
        } else {
            this.io.emit('game-progress-update', data);
        }
    }
};

module.exports = GameServices;