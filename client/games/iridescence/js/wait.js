Game.Wait = function (game){};

Game.Wait.prototype = {
	create: function () {
		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.waitingForPlayers = this.game.plugins.add(Phaser.Plugin.WaitingForPlayers, { title: 'Iridescence' });

        game.count = 5;
        text = game.add.text(game.world.centerX, game.world.centerY, game.count, { font: "192px monospace", fill: "#ddd", align: "center" });
        text.setShadow(1, 5, 'rgba(0,255,0,0.5)', 5);
        text.anchor.setTo(0.5, 0.5);

        game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, this.countdown, this);
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



		if (spaceKey.isDown) {
            game.state.start('Play');
		}
	},
    countdown: function () {

        game.count -= 1;

        text.setText(game.count);

        if (game.count === 0) {
            //game.state.start('Play');
        } else {
            game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, this.countdown, this);
        }
    }
};


//@ sourceURL=wait.js
