Phaser.Plugin.GameOver = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);
};

Phaser.Plugin.GameOver.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.GameOver.prototype.constructor = Phaser.Plugin.GameOver;

Phaser.Plugin.GameOver.prototype.init = function(options) {
    game.stage.backgroundColor = '#000';

    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

    this.socket = options.socket;

    options = {
        redScore: 2,
        blueScore: 1
    };



    if (options.stars) {
        //Stars
        var emitterA = game.add.emitter(game.world.centerX, game.world.centerY, 100);
        emitterA.makeParticles('stars');
        emitterA.setSize(900, 600);
        emitterA.gravity = 0;

        emitterA.minParticleScale = 0.2
        emitterA.maxParticleScale = 0.5
        emitterA.minParticleSpeed.setTo(-10, -10);
        emitterA.maxParticleSpeed.setTo(10, 10);
        emitterA.start(false, 5000, 50);

        var emitterB = game.add.emitter(game.world.centerX, game.world.centerY, 10);
        emitterB.makeParticles('stars');
        emitterB.setSize(900, 600);
        emitterB.gravity = 0;

        emitterB.minParticleScale = 1.0
        emitterB.maxParticleScale = 2.5
        emitterB.minParticleSpeed.setTo(-10, -10);
        emitterB.maxParticleSpeed.setTo(10, 10);
        emitterB.start(false, 5000, 500);
    }

    redScore = game.add.text(w/2 - 100, h/2 - 75, 'RED: ' + options.redScore, {fill: '#FDFFC4' });
    redScore.anchor.setTo(0.5, 0.5);
    redScore.font = 'Press Start 2P';
    redScore.fontSize = '30px';

    redScore = game.add.text(w/2, h/2 - 75, '-', {fill: '#FDFFC4' });
    redScore.anchor.setTo(0.5, 0.5);
    redScore.font = 'Press Start 2P';
    redScore.fontSize = '30px';

    blueScore = game.add.text(w/2 + 100, h/2 - 75, 'BLUE: ' + options.blueScore, {fill: '#FDFFC4' });
    blueScore.anchor.setTo(0.5, 0.5);
    blueScore.font = 'Press Start 2P';
    blueScore.fontSize = '30px';


    if (options.redScore !== options.blueScore) {
        var winner = options.redScore > options.blueScore ? 'RED' : 'BLUE';
        this.winnerText = game.add.text(w / 2, h / 2, 'Team ' + winner + ' Wins!', {fill: '#FFA824' });
        this.winnerText.anchor.setTo(0.5, 0.5);
        this.winnerText.font = 'Press Start 2P';
        this.winnerText.fontSize = '40px';
    }

    label2 = game.add.text(w/2, h / 2 - (h / 2) / 2 + 375, 'game still in progress', {fill: '#FDFFC4' });
    label2.anchor.setTo(0.5, 0.5);
    label2.font = 'Press Start 2P';
    label2.fontSize = '25px';

    game.add.tween(label2).to({ alpha: 0.1 }, 500, Phaser.Easing.Linear.None)
        .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None).loop().start();

    if (options.noise) {
        //Scanlines
        for (var i = 0; i < 100; i++) {
            sc = game.add.sprite(0, i * 6, "sc");
            sc.scale.x = 1;
            sc.scale.y = 1;
            sc.fixedToCamera = true;
            sc.alpha = 0.6;
        }

        //Noise
        noise = game.add.sprite(0, 0, "noise");
        noise.scale.x = 2;
        noise.scale.y = 2;
        noise.fixedToCamera = true;
        noise.alpha = 0.2;
        noise.animations.add('noiseloop', [0, 1, 2], 15, true);
        noise.animations.play('noiseloop');
    }

    this.socket.on('game-over-update', function (data) {
        label2.setText('');
    });
};

Phaser.Plugin.GameOver.prototype.update = function () {};