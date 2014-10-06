Game.Over = function (game){};

Game.Over.prototype = {
	init: function(options) {
        this.gameOver = this.game.plugins.add(Phaser.Plugin.GameOver, {socket: game.options.socket});

        this.game.options.socket.emit('player-update', {
            score: options.score,
            highestJump: options.highestJump,
            status: options.status
        });
    },

	update: function() {
		if (spaceKey.isDown) {
			game.state.start('Play');
		}
	}
};

