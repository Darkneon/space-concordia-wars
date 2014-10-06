Phaser.Plugin.GameOver = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);
};

Phaser.Plugin.GameOver.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.GameOver.prototype.constructor = Phaser.Plugin.GameOver;

Phaser.Plugin.GameOver.prototype.init = function(options) {
    game.stage.backgroundColor = '#000';

    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

    this.socket = options.socket;

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

    this.redScoreText = game.add.text(w/2 - 100, h/2 - 75, 'RED: ?', {fill: '#FDFFC4' });
    this.redScoreText.anchor.setTo(0.5, 0.5);
    this.redScoreText.font = 'Press Start 2P';
    this.redScoreText.fontSize = '30px';

    separator = game.add.text(w/2, h/2 - 75, '-', {fill: '#FDFFC4' });
    separator.anchor.setTo(0.5, 0.5);
    separator.font = 'Press Start 2P';
    separator.fontSize = '30px';

    this.blueScoreText = game.add.text(w/2 + 100, h/2 - 75, 'BLUE: ?', {fill: '#FDFFC4' });
    this.blueScoreText.anchor.setTo(0.5, 0.5);
    this.blueScoreText.font = 'Press Start 2P';
    this.blueScoreText.fontSize = '30px';

    this.gameInProgressText = game.add.text(w/2, h / 2 - (h / 2) / 2 + 375, 'game still in progress', {fill: '#FDFFC4' });
    this.gameInProgressText.anchor.setTo(0.5, 0.5);
    this.gameInProgressText.font = 'Press Start 2P';
    this.gameInProgressText.fontSize = '25px';

    game.add.tween(this.gameInProgressText).to({ alpha: 0.1 }, 500, Phaser.Easing.Linear.None)
        .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None).loop().start();

    this.socket.on('game-over-update', function (data) {
        this.gameInProgressText.setText('');
        this.redScore = data.redScore;
        this.blueScore = data.blueScore;
        this.redScoreText.setText('RED: ' + data.redScore);
        this.blueScoreText.setText('BLUE: ' + data.blueScore);
        this.displayWinner();
    }.bind(this));
};

Phaser.Plugin.GameOver.prototype.displayWinner = function () {
    if (this.redScore !== this.blueScore) {
        var winner = this.redScore > this.blueScore ? 'RED' : 'BLUE';
        this.winnerText = game.add.text(w / 2, h / 2, 'Team ' + winner + ' Wins!', {fill: '#FFA824' });
        this.winnerText.anchor.setTo(0.5, 0.5);
        this.winnerText.font = 'Press Start 2P';
        this.winnerText.fontSize = '40px';
    }
};

Phaser.Plugin.GameOver.prototype.update = function () {};