Game = Game || {};

Game.Load = function (game){};

Game.Load.prototype = {
    preload: function () {
        game.load.spritesheet('item', game.options.path  + '/assets/number-buttons.png', 160, 160);
    },
    create: function() {
        this.game.state.start('Wait');
    }
};
