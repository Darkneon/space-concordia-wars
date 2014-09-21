Game.Over = function (game){};

Game.Over.prototype = {
	init: function(score) {
	scoreV = score
	},
	create: function () {
		
		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		
		game.stage.backgroundColor = '#000';
		
		//Stars
		var emitterA = game.add.emitter(game.world.centerX, game.world.centerY, 100);
		emitterA.makeParticles('stars');
		emitterA.setSize(900,600);
		emitterA.gravity = 0;
		
		emitterA.minParticleScale = 0.2
		emitterA.maxParticleScale = 0.5
		emitterA.minParticleSpeed.setTo(-10, -10);
		emitterA.maxParticleSpeed.setTo(10, 10);
		emitterA.start(false, 5000, 50);
		
		var emitterB = game.add.emitter(game.world.centerX, game.world.centerY, 10);
		emitterB.makeParticles('stars');
		emitterB.setSize(900,600);
		emitterB.gravity = 0;
		
		emitterB.minParticleScale = 1.0
		emitterB.maxParticleScale = 2.5
		emitterB.minParticleSpeed.setTo(-10, -10);
		emitterB.maxParticleSpeed.setTo(10, 10);
		emitterB.start(false, 5000, 500);

        redScore = game.add.text(w/2 - 100, h/2 - 75, 'RED: 4', {fill: '#FDFFC4' });
        redScore.anchor.setTo(0.5, 0.5);
        redScore.font = 'Press Start 2P';
        redScore.fontSize = '30px';

        redScore = game.add.text(w/2, h/2 - 75, '-', {fill: '#FDFFC4' });
        redScore.anchor.setTo(0.5, 0.5);
        redScore.font = 'Press Start 2P';
        redScore.fontSize = '30px';

        blueScore = game.add.text(w/2 + 100, h/2 - 75, 'BLUE: 2', {fill: '#FDFFC4' });
        blueScore.anchor.setTo(0.5, 0.5);
        blueScore.font = 'Press Start 2P';
        blueScore.fontSize = '30px';


        label1 = game.add.text(w/2, h/2, 'Team RED Wins!', {fill: '#FFA824' });
        label1.anchor.setTo(0.5, 0.5);
        label1.font = 'Press Start 2P';
        label1.fontSize = '40px';

        label2 = game.add.text(w/2, h / 2 - (h / 2) / 2 + 375, 'game still in progress', {fill: '#FDFFC4' });
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
	},
	
	listener: function() {
		window.open("http://twitter.com/Ph4rm");
	},
	
	remute: function() {
		muteValue = (muteValue + 1) % 2
		ost.volume = 0.3 * muteValue
		mute.frame = 1 - muteValue
	},
	
	update: function() {
		if (spaceKey.isDown) {
			game.state.start('Play');
			//introm.stop()
			ost.stop();
		}
	}
};

