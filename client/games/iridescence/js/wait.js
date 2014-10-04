Game.Wait = function (game){};

Game.Wait.prototype = {
	create: function () {
		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.waitingForPlayers = this.game.plugins.add(Phaser.Plugin.WaitingForPlayers, { title: 'Iridescence' , socket: game.options.socket});
	},

	listener: function() {
		window.open("http://twitter.com/Ph4rm");
	},

	remute: function() {
		muteValue = (muteValue + 1) % 2;
		introm.volume = 0.3 * muteValue;
		mute.frame = 1 - muteValue
	},

	update: function() {
		//if (spaceKey.isDown) {
            game.state.start('Play');
	//	}
	}
};


//@ sourceURL=wait.js
