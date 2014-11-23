var GameServices = function(options) {
    var NOOP = function() {};
    options = options || {};
    options.events = options.events || {};
    this.managers = {};

    this.managers.iridescence = require('./games/iridescence-services.js');
    this.managers.invaders = require('./games/invaders-services.js');
    this.managers.tanks = require('./games/tanks-services.js');
    
    this.onGameOverUpdate = options.events.onGameOverUpdate;


   // this.socket = options.socket;
    this.io = options.io;

  //  this.events = {
  //      onPlayerReadySend: options.events.onPlayerReadySend || NOOP,
  //      onAllPlayersReadySend: options.events.onAllPlayersReadySend || NOOP,
  //      onGameOverOrGameStart: options.events.onSend || NOOP
  //  };
};

//GameServices.prototype.setIridescenceLevel = function(room) {
//    if(!room.iridescenceLevel) {
//        room.iridescenceLevel = this.managers.iridescence.generatePlatforms();
//    }
//    this.io.to(room.id).emit({levels: room});
//};

GameServices.prototype.processPlayerUpdate = function(data, playerId, playerList) {
    var manager = this.managers[data.game] || this.managers.iridescence;

    var data = manager.processPlayerUpdate(data, playerId, playerList);

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
            this.onGameOverUpdate({
                room: {
                    id: playerList[playerId].joinedRoom
                }
            });
        } else {
            this.io.emit('game-progress-update', data);
        }
    }
};

module.exports = GameServices;