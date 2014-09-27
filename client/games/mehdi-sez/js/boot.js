Game = {};

Game.Boot = function (game){};

Game.Boot.prototype = {
    preload: function () {
        //TODO: move to config
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.minWidth = 240;
        game.scale.maxWidth = 640;
        game.scale.minHeight = 170;
        game.scale.maxHeight = 500;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.setScreenSize();

        game.stage.backgroundColor = '#000';
    },

    create: function() {
        this.game.state.start('Load');
    }
};
