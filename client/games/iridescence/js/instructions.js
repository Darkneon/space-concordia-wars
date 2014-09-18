Game.Instructions = function (game){};

Game.Instructions.prototype = {
	create: function () {
		
		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		game.stage.backgroundColor = '#123';
		
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
		emitterB.maxParticleScale = 3.5
		emitterB.minParticleSpeed.setTo(-10, -10);
		emitterB.maxParticleSpeed.setTo(10, 10);
		emitterB.start(false, 5000, 500);
		
		//Text
		l1 = game.add.text(w/2, 50, 'Reality has split. To survive in its', {fill: '#FDFFC4' });
		l11 = game.add.text(w/2, 100, 'remnants you have to adapt to the world', {fill: '#FDFFC4' });
		l12 = game.add.text(w/2, 150, 'around you by switching between', {fill: '#FDFFC4' });
		l13 = game.add.text(w/2, 200, 'parallel Universes.', {fill: '#FDFFC4' });

		l2 = game.add.text(w/2, 300, 'SPACEBAR - jump/double jump', {fill: '#FFA824' });
		l3 = game.add.text(w/2, 350, 'A - switch to the red reality', {fill: '#FFA824' });
		l4 = game.add.text(w/2, 400, 'S - switch to the green reality', {fill: '#FFA824' });
		l5 = game.add.text(w/2, 450, 'D - switch to the blue reality', {fill: '#FFA824' });

		l1.anchor.setTo(0.5, 0.5);
		l1.font = 'Press Start 2P';
		l1.fontSize = '20px';
		
		l11.anchor.setTo(0.5, 0.5);
		l11.font = 'Press Start 2P';
		l11.fontSize = '20px';
		
		l12.anchor.setTo(0.5, 0.5);
		l12.font = 'Press Start 2P';
		l12.fontSize = '20px';
		
		l13.anchor.setTo(0.5, 0.5);
		l13.font = 'Press Start 2P';
		l13.fontSize = '20px';
		
		l2.anchor.setTo(0.5, 0.5);
		l2.font = 'Press Start 2P';
		l2.fontSize = '20px';
		
		l3.anchor.setTo(0.5, 0.5);
		l3.font = 'Press Start 2P';
		l3.fontSize = '20px';
		
		l4.anchor.setTo(0.5, 0.5);
		l4.font = 'Press Start 2P';
		l4.fontSize = '20px';
		
		l5.anchor.setTo(0.5, 0.5);
		l5.font = 'Press Start 2P';
		l5.fontSize = '20px';


		label = game.add.text(w/2, 500, 'press space to start', {fill: '#FDFFC4' });
		label.anchor.setTo(0.5, 0.5);
		label.font = 'Press Start 2P';
		label.fontSize = '20px';
		
		
		game.add.tween(label).to({ alpha: 0.1 }, 500, Phaser.Easing.Linear.None)
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
		introm.volume = 0.3 * muteValue
		mute.frame = 1 - muteValue
	},

	update: function() {
		if (spaceKey.isDown) {
			introm.stop();
			game.state.start('Play');
		}
	}
};

