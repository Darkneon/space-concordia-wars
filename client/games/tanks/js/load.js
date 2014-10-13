Game = Game || {};

Game.Load = function (game){};

Game.Load.prototype = {
	preload: function () {
        game.load.atlas('tank', game.options.path + '/assets/tanks.png', game.options.path + '/assets/tanks.json');
        game.load.atlas('enemy', game.options.path + '/assets/enemy-tanks.png', game.options.path + '/assets/tanks.json');
        game.load.image('logo', game.options.path + '/assets/logo.png');
        game.load.image('bullet', game.options.path + '/assets/bullet.png');
        game.load.image('earth', game.options.path + '/assets/scorched_earth.png');
        game.load.spritesheet('kaboom', game.options.path + '/assets/explosion.png', 64, 64, 23);

        game.load.image('phaser_touch_control_compass', game.options.commonPath + '/assets/compass_rose.png');
        game.load.image('phaser_touch_control_touch_segment', game.options.commonPath + '/assets/touch_segment.png');
        game.load.image('phaser_touch_control_touch', game.options.commonPath + '/assets/touch.png');

        game.load.image('left', game.options.commonPath + '/assets/left.png');
        game.load.image('right', game.options.commonPath + '/assets/right.png');
        game.load.image('up', game.options.commonPath + '/assets/up.png');

        game.load.spritesheet('coin', game.options.path + '/assets/coin.png', 32, 32);
	},
	create: function() {
		this.game.state.start('Wait');
	}
};
