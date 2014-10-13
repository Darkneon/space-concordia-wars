Game.Play = function (game){};


var player;
var aliens;
var bullets;
var ghostBullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];

var NUMBER_OF_BULLETS = 10;

Game.Play.prototype = {
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  The scrolling starfield background
        starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(NUMBER_OF_BULLETS, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'enemyBullet');
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        //  The hero!
        player = game.add.sprite(400, 500, 'ship');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);

        ghostPlayers = [];
        for (var i = 0; i < 1; i++) {
            var randomX = Math.round(Math.random() * (400 - 40)) + 40;
            var ghostPlayer = game.add.sprite(randomX, 500, 'ship');
            ghostPlayer.anchor.setTo(0.5, 0.5);

            game.physics.arcade.enable(ghostPlayer);
            ghostPlayer.enableBody = true;
            ghostPlayer.physicsBodyType = Phaser.Physics.ARCADE;
            ghostPlayer.alpha = 0.3;
            ghostPlayers.push(ghostPlayer);
        }

       ghostBullets = game.add.group();
       ghostBullets.enableBody = true;
       ghostBullets.physicsBodyType = Phaser.Physics.ARCADE;
       ghostBullets.createMultiple(NUMBER_OF_BULLETS * 2 *  ghostPlayers.length, 'bullet');
       ghostBullets.setAll('anchor.x', 0.5);
       ghostBullets.setAll('anchor.y', 1);
       ghostBullets.setAll('outOfBoundsKill', true);
       ghostBullets.setAll('checkWorldBounds', true);

        //  The baddies!
        aliens = game.add.group();
        aliens.enableBody = true;
        aliens.physicsBodyType = Phaser.Physics.ARCADE;

        this.createAliens();

        //  The score
        scoreString = 'Score : ';
        scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

        //  Lives
        lives = game.add.group();
        game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

        //  Text
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;

        for (var i = 0; i < 3; i++)
        {
            var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
            ship.anchor.setTo(0.5, 0.5);
            ship.angle = 90;
            ship.alpha = 0.4;
        }

        //  An explosion pool
        explosions = game.add.group();
        explosions.createMultiple(30, 'kaboom');
        explosions.forEach(this.setupInvader, this);

        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
        this.touchControl.inputEnable();
        this.touchControl.settings.singleDirection = true;

        this.socket = game.options.socket;
        var that = this;
        this.socket.on('game-progress-update', function (data) {

            data.players.forEach(function(dataPlayer) {
                if (dataPlayer.id !== this.io.engine.id) {
                    console.log('invaders game-progress-update', JSON.stringify(data.players, undefined, 2), this.io.engine.id);
                    ghostPlayers[0].x = dataPlayer.positionX;
                    ghostPlayers[0].y = dataPlayer.positionY;
                    if (dataPlayer.fired) {
                        that.fireGhostBullet(ghostPlayers[0]);
                    }
                }
            }, this);
        }, this);
    },
    createAliens: function() {

        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                var alien = aliens.create(x * 48, y * 50, 'invader');
                alien.anchor.setTo(0.5, 0.5);
                alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
                alien.play('fly');
                alien.body.moves = false;
            }
        }

        aliens.x = 100;
        aliens.y = 50;

        //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        //  When the tween loops it calls descend
        tween.onLoop.add(this.descend, this);
    },
    render: function () {
        game.debug.spriteInfo(ghostPlayers[0], 32, 32);
    },
    setupInvader: function(invader) {

        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');

    },
    descend: function() {
        aliens.y += 0;
    },
    update: function() {
        //  Scroll the background
        starfield.tilePosition.y += 2;

        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (this.touchControl.cursors.left)
        {
            player.body.velocity.x = -200;
            this.socket.emit('player-update', {
                score: score,
                status: 'alive',
                fired: false,
                game: 'invaders',
                positionX: player.x,
                positionY: player.y
            });

        }
        else if ( this.touchControl.cursors.right)
        {
            player.body.velocity.x = 200;
            this.socket.emit('player-update', {
                score: score,
                status: 'alive',
                fired: false,
                game: 'invaders',
                positionX: player.x,
                positionY: player.y
            });
        }

        //  Firing?
        if (fireButton.isDown)
        {
            this.fireBullet();
        }

        if (game.time.now > firingTimer)
        {
            this.enemyFires();
        }

        //  Run collision
        game.physics.arcade.overlap(bullets, aliens, this.collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player, this.enemyHitsPlayer, null, this);

    },
    collisionHandler: function(bullet, alien) {

        //  When a bullet hits an alien we kill them both
        bullet.kill();
        alien.kill();

        //  Increase the score
        score += 20;
        scoreText.text = scoreString + score;

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);

        if (aliens.countLiving() == 0)
        {
            score += 1000;
            scoreText.text = scoreString + score;

            enemyBullets.callAll('kill',this);
            stateText.text = " You Won, \n Click to restart";
            stateText.visible = true;

            //the "click to restart" handler
            game.input.onTap.addOnce(this.restart,this);
        }

    },
    enemyHitsPlayer: function(player,bullet) {

        bullet.kill();

        live = lives.getFirstAlive();

        if (live)
        {
            live.kill();
        }

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);

        // When the player dies
        if (lives.countLiving() < 1)
        {
            player.kill();
            enemyBullets.callAll('kill');

            stateText.text=" GAME OVER \n Click to restart";
            stateText.visible = true;

            //the "click to restart" handler
            game.input.onTap.addOnce(restart,this);
        }

    },
    enemyFires: function() {
        return;
        //  Grab the first bullet we can from the pool
        enemyBullet = enemyBullets.getFirstExists(false);

        livingEnemies.length=0;

        aliens.forEachAlive(function(alien){

            // put every living enemy in an array
            livingEnemies.push(alien);
        });


        if (enemyBullet && livingEnemies.length > 0)
        {

            var random=game.rnd.integerInRange(0,livingEnemies.length-1);

            // randomly select one of them
            var shooter=livingEnemies[random];
            // And fire the bullet from this enemy
            enemyBullet.reset(shooter.body.x, shooter.body.y);

            game.physics.arcade.moveToObject(enemyBullet,player,120);
            firingTimer = game.time.now + 2000;
        }

    },
    fireBullet: function () {

        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTime)
        {
            //  Grab the first bullet we can from the pool
            bullet = bullets.getFirstExists(false);

            if (bullet)
            {
                //  And fire it
                bullet.reset(player.x, player.y + 8);
                bullet.body.velocity.y = -400;
                bulletTime = game.time.now + 200;
                this.socket.emit('player-update', {
                    score: score,
                    status: 'alive',
                    fired: true,
                    game: 'invaders',
                    positionX: player.x,
                    positionY: player.y
                });

            }
        }

    },
    fireGhostBullet: function (ghost) {
        var bullet = ghostBullets.getFirstExists(false);
        if (bullet) {
            bullet.reset(ghost.x, ghost.y);
            bullet.body.velocity.y = -400;
        }
    },
    resetBullet: function(bullet) {

        //  Called if the bullet goes out of the screen
        bullet.kill();

    },
    restart: function() {

        //  A new level starts

        //resets the life count
        lives.callAll('revive');
        //  And brings the aliens back from the dead :)
        aliens.removeAll();
        this.createAliens();

        //revives the player
        player.revive();
        //hides the text
        stateText.visible = false;

    }
};
//@ sourceURL=play.js