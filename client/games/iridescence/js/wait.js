Game.Wait = function (game){};

Game.Wait.prototype = {
	create: function () {

		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		game.stage.backgroundColor = '#000';

		//Stars
		var emitterA = game.add.emitter(game.world.centerX, game.world.centerY, 100);
		emitterA.makeParticles('stars');
		emitterA.setSize(900,600);
		emitterA.gravity = 0;

		emitterA.minParticleScale = 0.2;
		emitterA.maxParticleScale = 0.5;
		emitterA.minParticleSpeed.setTo(-10, -10);
		emitterA.maxParticleSpeed.setTo(10, 10);
		emitterA.start(false, 5000, 50);

		var emitterB = game.add.emitter(game.world.centerX, game.world.centerY, 10);
		emitterB.makeParticles('stars');
		emitterB.setSize(900,600);
		emitterB.gravity = 0;

		emitterB.minParticleScale = 1.0;
		emitterB.maxParticleScale = 2.5;
		emitterB.minParticleSpeed.setTo(-10, -10);
		emitterB.maxParticleSpeed.setTo(10, 10);
		emitterB.start(false, 5000, 500);

		//Text
        var halfHeight = Math.round(h / 2);
		label1 = game.add.text(w/2, halfHeight - halfHeight / 2 - 25, 'IRIDESCENCE', {fill: '#FFA824' });
		label1.anchor.setTo(0.5, 0.5);
		label1.font = 'Press Start 2P';
		label1.fontSize = '40px';

		label2 = game.add.text(w/2,halfHeight - halfHeight / 2 + 25, 'waiting for players', {fill: '#FDFFC4' });
		label2.anchor.setTo(0.5, 0.5);
		label2.font = 'Press Start 2P';
		label2.fontSize = '25px';

		game.add.tween(label2).to({ alpha: 0.1 }, 500, Phaser.Easing.Linear.None)
			.to({ alpha: 1 }, 500, Phaser.Easing.Linear.None).loop().start();

		label3 = game.add.text(650, 550, 'Pharm (@Ph4rm)', {fill: '#FDFFC4' });
		label3.font = 'Press Start 2P';
		label3.fontSize = '15px';

		label3.inputEnabled = true;
		label3.events.onInputDown.add(this.listener, this);

		introm = game.add.audio('intromusic');
		introm.play('', 0, 0.3 * muteValue,true);


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
            game.state.start('Play');
        } else {
            game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, this.countdown, this);
        }
    }
};

