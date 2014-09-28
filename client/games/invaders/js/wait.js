Game = Game || {};

Game.Wait = function (game){};

//TODO: change namespace name
//TODO: have a common wait state between all games
Game.Wait.prototype = {
    create: function() {
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.waitingForPlayers = this.game.plugins.add(Phaser.Plugin.WaitingForPlayers, { title: 'Invaders', stars: false, noise: false});
    },
    update: function() {
        if (spaceKey.isDown) {
            game.state.start('Play');
        }
    }
};
