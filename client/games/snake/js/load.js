Game = Game || {};

Game.Load = function (game){};

Game.Load.prototype = {
    preload: function () {
        this.background = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBackground');
        this.background.anchor.setTo(0.5,0.5);
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
        this.preloadBar.anchor.setTo(0,0.5);
        this.preloadBar.x = this.world.centerX - this.preloadBar.width*0.5;

        this.load.setPreloadSprite(this.preloadBar);

        //all the game sprites have been combined into a single image
        this.load.atlas('spriteSet', game.options.path + '/assets/spriteSet.png', game.options.path + '/assets/spriteSet.jsona');
        //load game font
        this.load.bitmapFont('olijo', game.options.path + '/assets/font/font.png', game.options.path + '/assets/font/font.fnt');
        //load game sounds
        this.load.audio('eat',[game.options.path + '/assets/sounds/eat.mp3',game.options.path + '/assets/sounds/eat.ogg',game.options.path + '/assets/sounds/eat.wav',game.options.path + '/assets/sounds/eat.m4a']);

    },
    create: function() {
        this.preloadBar.cropEnabled = false;
    },
    update: function () {
        if(this.cache.isSoundDecoded('eat')){
            this.state.start('Wait');
        }
    }
};
