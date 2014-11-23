//game over - display final scores, display dead / alive players
//start new game
//player disconnects

var PostGameService = function(options) {
    options = options || {};

    this.preGameServices = options.preGameServices;
    this.inProgress = {};
    this.io = options.io;
};

PostGameService.prototype.startNextGame = function(room) {
    if (this.inProgress[room.id]) {
        return;
    } else {
        this.inProgress[room.id] = true;
    }

    var that = this;
    setTimeout(function () {
        that.preGameServices.startNextGame(room);
    }, 5000);
};

module.exports = PostGameService;