Game.Over = function (game){};

Game.Over.prototype = {
    init: function(options) {
        this.gameOver = this.game.plugins.add(Phaser.Plugin.GameOver, {socket: game.options.socket});
    },
    update: function() {
    }
};

