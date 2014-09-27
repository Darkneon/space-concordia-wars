Game.Over = function (game){};

Game.Over.prototype = {
	init: function(score) {
	scoreV = score
	},
	create: function () {
        this.gameOver = this.game.plugins.add(Phaser.Plugin.GameOver);
	},
	update: function() {
		if (spaceKey.isDown) {
			game.state.start('Play');
		}
	}
};

