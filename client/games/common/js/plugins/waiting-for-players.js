Phaser.Plugin.WaitingForPlayers = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);
};

Phaser.Plugin.WaitingForPlayers.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.WaitingForPlayers.prototype.constructor = Phaser.Plugin.WaitingForPlayers;

Phaser.Plugin.WaitingForPlayers.prototype.init = function(options) {
    game.stage.backgroundColor = '#000';

    //Stars
    var smallStarsEmitter = game.add.emitter(game.world.centerX, game.world.centerY, 100);
    smallStarsEmitter.makeParticles('stars');
    smallStarsEmitter.setSize(900,600);
    smallStarsEmitter.gravity = 0;

    smallStarsEmitter.minParticleScale = 0.2;
    smallStarsEmitter.maxParticleScale = 0.5;
    smallStarsEmitter.minParticleSpeed.setTo(-10, -10);
    smallStarsEmitter.maxParticleSpeed.setTo(10, 10);
    smallStarsEmitter.start(false, 5000, 50);

    var bigStarsEmitter = game.add.emitter(game.world.centerX, game.world.centerY, 10);
    bigStarsEmitter.makeParticles('stars');
    bigStarsEmitter.setSize(900,600);
    bigStarsEmitter.gravity = 0;

    bigStarsEmitter.minParticleScale = 1.0;
    bigStarsEmitter.maxParticleScale = 2.5;
    bigStarsEmitter.minParticleSpeed.setTo(-10, -10);
    bigStarsEmitter.maxParticleSpeed.setTo(10, 10);
    bigStarsEmitter.start(false, 5000, 500);

    //Text
    var halfHeight = Math.round(h / 2);
    this.title = game.add.text(w/2, halfHeight - halfHeight / 2 - 25, options.title, {fill: '#FFA824' });
    this.title.anchor.setTo(0.5, 0.5);
    this.title.font = 'Press Start 2P';
    this.title.fontSize = '40px';

    this.waiting = game.add.text(w/2,halfHeight - halfHeight / 2 + 25, 'waiting for players', {fill: '#FDFFC4' });
    this.waiting.anchor.setTo(0.5, 0.5);
    this.waiting.font = 'Press Start 2P';
    this.waiting.fontSize = '25px';

    game.add.tween(this.waiting).to({ alpha: 0.1 }, 500, Phaser.Easing.Linear.None)
        .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None).loop().start();

    /*
    label3 = game.add.text(650, 550, 'Pharm (@Ph4rm)', {fill: '#FDFFC4' });
    label3.font = 'Press Start 2P';
    label3.fontSize = '15px';

    label3.inputEnabled = true;
    label3.events.onInputDown.add(this.listener, this);

    introm = game.add.audio('intromusic');
    introm.play('', 0, 0.3 * muteValue,true);
    */
/*
    // Points
    var points = [];
    var height = Math.round(h - 350);
    points.push(game.add.text(50, height, '2pt for winning team', {fill: '#FFA824' }));
    points.push(game.add.text(50, height + 40, '1pt for each player with score over 9000', {fill: '#FFA824' }));
    points.push(game.add.text(50, height + 80, '1pt to team with player with the highest jump', {fill: '#FFA824' }));

    points.forEach(function(point) {
        point.anchor.setTo(0, 0);
        point.font = 'Press Start 2P';
        point.fontSize = '20px';
    });

    // Instructions
    var instructions = [];
    height = Math.round(h - 200);
    instructions.push(game.add.text(50, height, 'SPACEBAR - jump/double jump', {fill: '#FFA824' }));
    instructions.push(game.add.text(50, height + 40, 'A - switch to the red reality', {fill: '#FFA824' }));
    instructions.push(game.add.text(50, height + 80, 'S - switch to the green reality', {fill: '#FFA824' }));
    instructions.push(game.add.text(50, height + 120, 'D - switch to the blue reality', {fill: '#FFA824' }));

    instructions.forEach(function(instruction) {
        instruction.anchor.setTo(0, 0);
        instruction.font = 'Press Start 2P';
        instruction.fontSize = '20px';
    });

    //Mute
    mute = game.add.sprite(870, 8, "mute");
    mute.inputEnabled = true;
    mute.events.onInputDown.add(this.remute, this);
    mute.frame = 1 - muteValue
*/
    //Scanlines
    for (var i = 0; i < 100; i++) {
        sc = game.add.sprite(0, i*6, "sc");
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
    noise.animations.add('noiseloop',[0, 1, 2],15,true);
    noise.animations.play('noiseloop');
};

Phaser.Plugin.WaitingForPlayers.prototype.setSocket = function (socket) {
    this._socket = socket;
};

Phaser.Plugin.WaitingForPlayers.prototype.update = function () {};