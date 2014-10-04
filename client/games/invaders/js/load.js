Game = Game || {};

Game.Load = function (game){};

Game.Load.prototype = {
    preload: function () {
        game.load.image('bullet', game.options.path + '/assets/bullet.png');
        game.load.image('enemyBullet', game.options.path + '/assets/enemy-bullet.png');
        game.load.spritesheet('invader', game.options.path + '/assets/invader32x32x4.png', 32, 32);
        game.load.image('ship', game.options.path + '/assets/player.png');
        game.load.spritesheet('kaboom', game.options.path + '/assets/explode.png', 128, 128);
        game.load.image('starfield', game.options.path + '/assets/starfield.png');
        game.load.image('background', game.options.path + '/assets/background2.png');

        game.load.image('phaser_touch_control_compass',  game.options.commonPath + '/assets/compass_rose.png');
        game.load.image('phaser_touch_control_touch_segment', game.options.commonPath + '/assets/touch_segment.png');
        game.load.image('phaser_touch_control_touch', game.options.commonPath + '/assets/touch.png');
    },
    create: function() {
        this.game.state.start('Wait');
    }
};
