(function() {
    var Tank = function (options) {
        EnemyTank = function (index, game, player, bullets) {

            var x = game.world.randomX;
            var y = game.world.randomY;

            this.game = game;
            this.health = 3;
            this.player = player;
            this.bullets = bullets;
            this.fireRate = 1000;
            this.nextFire = 0;
            this.alive = true;

            this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
            this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
            this.turret = game.add.sprite(x, y, 'enemy', 'turret');

            this.shadow.anchor.set(0.5);
            this.tank.anchor.set(0.5);
            this.turret.anchor.set(0.3, 0.5);

            this.tank.name = index.toString();
            game.physics.enable(this.tank, Phaser.Physics.ARCADE);
            this.tank.body.immovable = false;
            this.tank.body.collideWorldBounds = true;
            this.tank.body.bounce.setTo(1, 1);

            this.tank.angle = game.rnd.angle();

            game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);

        };

        EnemyTank.prototype.damage = function() {

            this.health -= 1;

            if (this.health <= 0)
            {
                this.alive = false;

                this.shadow.kill();
                this.tank.kill();
                this.turret.kill();

                return true;
            }

            return false;

        }

        EnemyTank.prototype.update = function() {

            this.shadow.x = this.tank.x;
            this.shadow.y = this.tank.y;
            this.shadow.rotation = this.tank.rotation;

            this.turret.x = this.tank.x;
            this.turret.y = this.tank.y;
            this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);

            if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300)
            {
                if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
                {
                    this.nextFire = this.game.time.now + this.fireRate;

                    var bullet = this.bullets.getFirstDead();

                    bullet.reset(this.turret.x, this.turret.y);

                    bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
                }
            }

        };

        var game = new Phaser.Game(800, 600, Phaser.AUTO, 'theGame', { preload: preload, create: create, update: update, render: render });
        game.options = options;

        function preload () {

            game.load.atlas('tank', game.options.path + '/assets/tanks.png', game.options.path + '/assets/tanks.json');
            game.load.atlas('enemy', game.options.path + '/assets/enemy-tanks.png', game.options.path + '/assets/tanks.json');
            game.load.image('logo', game.options.path + '/assets/logo.png');
            game.load.image('bullet', game.options.path + '/assets/bullet.png');
            game.load.image('earth', game.options.path + '/assets/scorched_earth.png');
            game.load.spritesheet('kaboom', game.options.path + '/assets/explosion.png', 64, 64, 23);

            game.load.image('phaser_touch_control_compass', game.options.path + '/assets/compass_rose.png');
            game.load.image('phaser_touch_control_touch_segment', game.options.path + '/assets/touch_segment.png');
            game.load.image('phaser_touch_control_touch', game.options.path + '/assets/touch.png');

            game.load.spritesheet('coin', game.options.path + '/assets/coin.png', 32, 32);

            game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            game.scale.minWidth = 240;
            game.scale.maxWidth = 640;
            game.scale.minHeight = 170;
            game.scale.maxHeight = 500;
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.scale.setScreenSize();
        }

        var land;

        var shadow;
        var tank;
        var turret;

        var enemies;
        var enemyBullets;
        var enemiesTotal = 0;
        var enemiesAlive = 0;
        var explosions;

        var logo;

        var currentSpeed = 0;
        var cursors;

        var bullets;
        var fireRate = 100;
        var nextFire = 0;

        function create () {

            //  Our tiled scrolling background
            land = game.add.tileSprite(0, 0, 800, 600, 'earth');
            land.fixedToCamera = true;

            //  The base of our tank
            tank = game.add.sprite(0, 0, 'tank', 'tank1');
            tank.anchor.setTo(0.5, 0.5);
            tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

            //  This will force it to decelerate and limit its speed
            game.physics.enable(tank, Phaser.Physics.ARCADE);
            tank.body.drag.set(0.2);
            tank.body.maxVelocity.setTo(400, 400);
            tank.body.collideWorldBounds = true;

            //  Finally the turret that we place on-top of the tank body
            turret = game.add.sprite(0, 0, 'tank', 'turret');
            turret.anchor.setTo(0.3, 0.5);

            //  The enemies bullet group
            enemyBullets = game.add.group();
            enemyBullets.enableBody = true;
            enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
            enemyBullets.createMultiple(100, 'bullet');

            enemyBullets.setAll('anchor.x', 0.5);
            enemyBullets.setAll('anchor.y', 0.5);
            enemyBullets.setAll('outOfBoundsKill', true);
            enemyBullets.setAll('checkWorldBounds', true);

            //  Create some baddies to waste :)
            enemies = [];

            enemiesTotal = 20;
            enemiesAlive = 20;

            for (var i = 0; i < enemiesTotal; i++)
            {
                enemies.push(new EnemyTank(i, game, tank, enemyBullets));
            }

            //  A shadow below our tank
            shadow = game.add.sprite(0, 0, 'tank', 'shadow');
            shadow.anchor.setTo(0.5, 0.5);

            //  Our bullet group
            bullets = game.add.group();
            bullets.enableBody = true;
            bullets.physicsBodyType = Phaser.Physics.ARCADE;
            bullets.createMultiple(50, 'bullet', 0, false);
            bullets.setAll('anchor.x', 0.5);
            bullets.setAll('anchor.y', 0.5);
            bullets.setAll('outOfBoundsKill', true);
            bullets.setAll('checkWorldBounds', true);

            //  Explosion pool
            explosions = game.add.group();

            for (var i = 0; i < 10; i++)
            {
                var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
                explosionAnimation.anchor.setTo(0.5, 0.5);
                explosionAnimation.animations.add('kaboom');
            }

            tank.bringToTop();
            turret.bringToTop();

            logo = game.add.sprite(0, 200, 'logo');
            logo.fixedToCamera = true;

            game.input.onDown.add(removeLogo, this);

            game.camera.follow(tank);
            game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
            game.camera.focusOnXY(0, 0);

            cursors = game.input.keyboard.createCursorKeys();
            this.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
            this.touchControl.inputEnable();

            //TODO: server should call when to add coins   
            coin = game.add.sprite(200, 200, 'coin');
            game.physics.enable(coin, Phaser.Physics.ARCADE);
            coin.anchor.setTo(0.5, 0.5);
            coin.animations.add('spin');
            coin.animations.play('spin', 15, true);
        }

        function removeLogo () {

            game.input.onDown.remove(removeLogo, this);
            logo.kill();

        }

        function update () {

            game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);
            game.physics.arcade.overlap(tank, coin, function() {
                coin.kill();
            }, null, this);

            enemiesAlive = 0;

            for (var i = 0; i < enemies.length; i++)
            {
                if (enemies[i].alive)
                {
                    enemiesAlive++;
                    game.physics.arcade.collide(tank, enemies[i].tank);
                    game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
                    enemies[i].update();
                }
            }

            if (cursors.left.isDown)
            {
                tank.angle -= 4;
            }
            else if (cursors.right.isDown)
            {
                tank.angle += 4;
            }

            if (cursors.up.isDown)
            {
                //  The speed we'll travel at
                currentSpeed = 300;
            }
            else
            {
                if (currentSpeed > 0)
                {
                    currentSpeed -= 4;
                }
            }

            if (currentSpeed > 0)
            {
                game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
            }

            land.tilePosition.x = -game.camera.x;
            land.tilePosition.y = -game.camera.y;

            //  Position all the parts and align rotations
            shadow.x = tank.x;
            shadow.y = tank.y;
            shadow.rotation = tank.rotation;

            turret.x = tank.x;
            turret.y = tank.y;

            var rot = Phaser.Math.radToDeg(Phaser.Math.angleBetween(0, 0,-this.touchControl.speed.x, -this.touchControl.speed.y));
            turret.angle = rot;

            if (game.input.activePointer.isDown)
            {
                //  Boom!
                fire(rot, -this.touchControl.speed.x, -this.touchControl.speed.y);
            }

        }

        function bulletHitPlayer (tank, bullet) {

            bullet.kill();

        }

        function bulletHitEnemy (tank, bullet) {

            bullet.kill();

            var destroyed = enemies[tank.name].damage();

            if (destroyed)
            {
                var explosionAnimation = explosions.getFirstExists(false);
                explosionAnimation.reset(tank.x, tank.y);
                explosionAnimation.play('kaboom', 30, false, true);
            }

        }

        function fire (bulletRotation, x, y) {

            if (game.time.now > nextFire && bullets.countDead() > 0)
            {
                nextFire = game.time.now + fireRate;

                var bullet = bullets.getFirstExists(false);

                bullet.reset(turret.x, turret.y);

                console.log(x, y);
                bullet.rotation = game.physics.arcade.moveToXY(bullet, x * 100, y * 100, 400);
            }

        }

        function render () {

            // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
            game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);

        }
    };

    window.T = Tank;
})();


//@ sourceURL=tanks.js