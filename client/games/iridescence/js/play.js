Game.Play = function (game){};

Game.Play.prototype = {

	create: function () {

		//Inits	
		game.time.advancedTiming = true;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		jumpCount = 0;
		jumpkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		redKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		greenKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
		blueKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
		
		currColor = 0
		hitt = 0
		jumptimer = 0;
		
//		Stars
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
		emitterB.setSize(w,h);
		emitterB.gravity = 0;

		emitterB.minParticleScale = 1.0
		emitterB.maxParticleScale = 2.5
		emitterB.minParticleSpeed.setTo(-10, -10);
		emitterB.maxParticleSpeed.setTo(10, 10);
		emitterB.start(false, 5000, 500);
//
		//Audio
		jump = game.add.audio('jump');
		hit = game.add.audio('hit');
		explode = game.add.audio('explode');
		
		ost = game.add.audio('ost');
		ost.play('', 0, 0.3 * muteValue,true);
		
		//Mute
		mute = game.add.sprite(870, 8, "mute");
		mute.inputEnabled = true;
		mute.events.onInputDown.add(this.remute, this);
		mute.frame = 1 - muteValue

		//Player
		player = game.add.sprite(100, h - 400, "player");
		game.physics.arcade.enable(player);
		player.body.bounce.y = 0;
		player.body.gravity.y = 2000;
		player.body.checkCollision.up = false;
		player.body.checkCollision.left = false;
		player.body.checkCollision.right = false;
		
		player.animations.add('red', [0], 10, true);
		player.animations.add('green', [1], 10, true);
		player.animations.add('blue', [2], 10, true);
		
		//Platforms
		firstPlatform = game.add.sprite(50, h - 100, "platformW");
		game.physics.arcade.enable(firstPlatform);
		firstPlatform.body.velocity.x = -800; 
		firstPlatform.checkWorldBounds = true;
		firstPlatform.outOfBoundsKill = true;
		firstPlatform.body.immovable = true;
		firstPlatform.body.checkCollision.down = false;
		firstPlatform.body.checkCollision.left = false;
		firstPlatform.body.checkCollision.right = false;
		firstPlatform.scale.x = 2
		
		platformsA = game.add.group();
		platformsA.enableBody = true;
		platformsB = game.add.group();
		platformsB.enableBody = true;
		platforms = game.add.group();
		platforms.enableBody = true;
		timer = game.time.events.loop(2300, this.addPlatform, this);
		
		reds = game.add.group();
		reds.enableBody = true;
		greens = game.add.group();
		greens.enableBody = true;
		blues = game.add.group();
		blues.enableBody = true;
		whites = game.add.group();
		whites.enableBody = true;
	
		//Txt
		score = game.add.text(10, 10, 'SCORE: 0', {fill: '#FDFFC4'});
		score.font = 'Press Start 2P';
		score.fontSize = '20px';
		scoreV = 0
		
		fps = game.add.text(10, 40, 'FPS: 0', {fill: '#FDFFC4' });
		fps.font = 'Press Start 2P';
		fps.fontSize = '20px';

        this.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
        this.touchControl.inputEnable();
        this.touchControl.settings.singleDirection = true;
    },
	
	update: function(){
		scoreV+=10

		game.physics.arcade.collide(player, firstPlatform, overlapHandler, null, this);
		game.physics.arcade.collide(player, whites, overlapHandler, null, this);
		
		if(currColor == 0)
			game.physics.arcade.collide(player, reds, overlapHandler, null, this);
		if(currColor == 1)
			game.physics.arcade.collide(player, greens, overlapHandler, null, this);
		if(currColor == 2)
			game.physics.arcade.collide(player, blues, overlapHandler, null, this);
		
		function overlapHandler (obj1, obj2) {
			player.x = 100
			if(hitt == 0) {
				hit.play('', 0, 0.3*muteValue,false);
				hitt = 1
			}
		}
		

		if (player.body.touching.down) {
			player.scale.x = 1.0
			player.scale.y = 1.0
			jumpCount = 0
		}

		//GUI
		fps.setText('FPS: ' + game.time.fps);
		
		if(scoreV<100)
			score.setText('SCORE: 0000' + scoreV)
		else if(scoreV<1000)
			score.setText('SCORE: 000' + scoreV)
		else if(scoreV<10000)
			score.setText('SCORE: 00' + scoreV)
		else if(scoreV<100000)
			score.setText('SCORE: 0' + scoreV)
		else
			score.setText('SCORE: ' + scoreV)

        if (game.input.activePointer.isDown) {
            if (this.touchControl.cursors.left) {
                currColor = 0
                player.animations.play('red');
            }
            if (this.touchControl.cursors.down) {
                currColor = 1
                player.animations.play('green');
            }
            if (this.touchControl.cursors.right) {
                currColor = 2
                player.animations.play('blue');
            }
            if (this.touchControl.cursors.up && player.body.touching.down) {
                jumptimer = 1;
                player.body.velocity.y = -800;
                jumpCount = 1;
                hitt = 0
                jump.play('', 0, 0.3 * muteValue, false);
                player.scale.x = 0.9
                player.scale.y = 1.1

            }
            else if (this.touchControl.cursors.up && (jumptimer == 0) && jumpCount == 0) {
                player.body.velocity.y = -800;
                jump.play('', 0, 0.3 * muteValue, false);
                jumpCount = 1
                jumptimer = 1;
                player.scale.x = 0.9
                player.scale.y = 1.1
            }
            else if (this.touchControl.cursors.up && (jumptimer != 0)) {
                if (jumptimer > 30) {
                    jumptimer = 0;
                    jumpCount = 1
                    player.scale.x = 1.0
                    player.scale.y = 1.0
                }
                else {
                    jumptimer++;
                    player.body.velocity.y = -500;
                }
            }
            else if (!this.touchControl.cursors.up && (jumptimer == 0) && jumpCount == 1) {
                jumpCount = 2
                player.scale.x = 1.0
                player.scale.y = 1.0
            }
            else if (jumptimer != 0) {
                jumptimer = 0;
                jumpCount = 1
                player.scale.x = 1.0
                player.scale.y = 1.0
            }
            else if (this.touchControl.cursors.up && (jumptimer == 0) && jumpCount == 2) {
                player.body.velocity.y = -800;
                jump.play('', 0, 0.3 * muteValue, false);
                jumpCount = 3
                player.scale.x = 0.9
                player.scale.y = 1.1
            }
            else if (!this.touchControl.cursors.up && jumpCount == 3) {
                player.scale.x = 1.0
                player.scale.y = 1.0
            }
        }
		
		//restart
		if (player.position.y > h)
			this.restartGame();

	},
	
	createPlatform: function(x, y, color) {
		
		// Get the first dead pipe of our group
		
		var platformA
		var platformB
		var platform
		
		if(color == 1) {
			
			platformA = platformsA.create(x+5, y+2, 'platformG');
			platformB = platformsB.create(x-5, y-2, 'platformB');
			platform = platforms.create(x, y, 'platformR');
			reds.add(platform)
		}
		else if(color == 2) {
			
			platformA = platformsA.create(x+5, y+2, 'platformB');
			platformB = platformsB.create(x-5, y-2, 'platformR');
			platform = platforms.create(x, y, 'platformG');
			greens.add(platform)
		}
		else if(color ==  3) {
			
			platformA = platformsA.create(x+5, y+2, 'platformR');
			platformB = platformsB.create(x-5, y-2, 'platformG');
			platform = platforms.create(x, y, 'platformB');
			blues.add(platform)
		}
		else {
			platform = platforms.create(x, y, 'platformN');
			platformA = platformsA.create(x, y+2000, 'platformR');
			platformB = platformsB.create(x, y+2000, 'platformG');
			whites.add(platform)
		}	

		// Add velocity to the pipe to make it move left
		platformA.body.velocity.x = -800; 
		platformB.body.velocity.x = -800; 
		platform.body.velocity.x = -800; 
		
		//Scale
		res = Math.floor(Math.random()*(5-2+1)+2)
		platform.scale.x = res
		platformA.scale.x = res
		platformB.scale.x = res

		// Kill the pipe when it's no longer visible 
		platformA.checkWorldBounds = true;
		platformA.outOfBoundsKill = true;
		platformA.body.immovable = true;
		platformA.body.checkCollision.down = false;
		platformA.body.checkCollision.left = false;
		platformA.body.checkCollision.right = false;
		platformA.body.checkCollision.up = false;

		platformB.checkWorldBounds = true;
		platformB.outOfBoundsKill = true;
		platformB.body.immovable = true;
		platformB.body.checkCollision.down = false;
		platformB.body.checkCollision.left = false;
		platformB.body.checkCollision.right = false;
		platformB.body.checkCollision.up = false;
		
		platform.checkWorldBounds = true;
		platform.outOfBoundsKill = true;
		platform.body.immovable = true;
		platform.body.checkCollision.down = false;
		platform.body.checkCollision.left = false;
		platform.body.checkCollision.right = false;	
		
	},
	remute: function() {
		muteValue = (muteValue + 1) % 2
		ost.volume = 0.3 * muteValue
		jump.volume = 0.3 * muteValue
		hit.volume = 0.3 * muteValue
		explode.volume = 0.3 * muteValue
		mute.frame = 1 - muteValue
	},
	
	addPlatform: function() {  
		var posY = Math.floor(Math.random()*(h-300+1)+300)
		var color = Math.floor(Math.random() * ((4-1)+1) + 1);
		this.createPlatform(w, posY, color);
	},
	
	restartGame: function() {  
		explode.play('', 0, 0.3*muteValue,false);
		game.state.start('Over', true, false, scoreV);
		
	},
	
}

//@ sourceURL=play.js