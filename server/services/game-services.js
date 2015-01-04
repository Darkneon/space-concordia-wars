var GameServices = function(options) {
    var NOOP = function() {};
    options = options || {};
    options.events = options.events || {};
    this.managers = {};

    this.managers.iridescence = require('./games/iridescence-services.js');
    this.managers.tanks = require('./games/tanks-services.js');
    this.managers.podium = require('./games/podium-services.js');

    this.io = options.io;
    this.inProgress = {};

    this.events = {
        onPlayerReadySend: options.events.onPlayerReadySend || NOOP,
        onAllPlayersReadySend: options.events.onAllPlayersReadySend || NOOP,
        onGameOverOrGameStart: options.events.onSend || NOOP
    };
};

GameServices.prototype.setPlayerReady = function(room, playerId) {
    room.players[playerId].setReady();
    this.events.onPlayerReadySend(null, room, playerId);
    if(room.allPlayersReady()) {
        this.events.onAllPlayersReadySend(null, room);
    }
};

GameServices.prototype.startNextGame = function(room) {
    if (this.inProgress[room.id]) {
        return;
    } else {
        this.inProgress[room.id] = true;
    }

    var game = room.getNextGame();
    if (game) {
        var gamedata = {
            extra: this.managers[game].init(),
            currentGame: game
        };

        console.log('load-game', game);
        this.io.to(room.id).emit('load-game', gamedata);
    }
//        var that = this;
//        setTimeout(function () {
//            that.preGameServices.startNextGame(room);
//        }, 5000);

    // else to some logging
};

GameServices.prototype.processPlayerUpdate = function(data, playerId, playerList, room) {
    var manager = this.managers[data.game] || this.managers.iridescence;

    var data = manager.processPlayerUpdate(data, playerId, playerList);

    var allDead = room.allPlayersDead();

    console.log(JSON.stringify(room, undefined, 2));
    if (data) {
        if (allDead) {
            this.io.emit('game-over-update', {
                highestJump: 'player1',
                redScore: data.redScore,
                blueScore: data.blueScore
            });
            this.inProgress[room.id] = false;

            var that = this;
            setTimeout(function() {
                that.startNextGame(room);
            }, 5000);

        } else {
            this.io.emit('game-progress-update', data);
        }
    }
};

module.exports = GameServices;