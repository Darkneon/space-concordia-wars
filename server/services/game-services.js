var GameServices = function(options) {
    var NOOP = function() {};
    options = options || {};
    options.events = options.events || {};
    this.iridescenceManager = require('./games/iridescence-services.js')



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

module.exports = GameServices;