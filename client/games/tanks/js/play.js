Game = Game || {};

Game.EnemyTank = function (index, game, player, bullets) {
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

    game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, 0);

};

Game.EnemyTank.prototype.setX = function (value) {
    this.tank.x = value;
    this.shadow.x = this.tank.x;
    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
};

Game.EnemyTank.prototype.setY = function (value) {
    this.tank.y = value;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;

    this.turret.y = this.tank.y;
};

Game.EnemyTank.prototype.setTurret = function (value) {
    this.turret.angle = value;
};


Game.EnemyTank.prototype.setVelocity = function (value) {
    this.tank.body.velocity = value;
};
Game.EnemyTank.prototype.setRotation = function (value) {
    this.tank.rotation = value;
};

Game.EnemyTank.prototype.damage = function() {

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

};

Game.EnemyTank.prototype.update = function() {

    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
};

Game.Play = function (game){};

Game.Play.prototype = {
    create: function() {

        nextFire = 0;
        currentSpeed = 0;
        fireRate = 300;
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
        friends = [];
        enemies = [];

        enemiesTotal = 1;
        enemiesAlive = 1;

        for (var i = 0; i < enemiesTotal; i++)
        {
            enemies.push(new Game.EnemyTank(i, game, tank, enemyBullets));
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


        game.camera.follow(tank);
        game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        game.camera.focusOnXY(0, 0);

        cursors = game.input.keyboard.createCursorKeys();
        this.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
        this.touchControl.inputEnable();



        this.leftButton = game.add.sprite(25, game.world.height - 64, 'left');
        this.leftButton.inputEnabled = true;
        this.leftButton.alpha = 0.5;

        this.rightButton = game.add.sprite(100, game.world.height - 64, 'right');
        this.rightButton.inputEnabled = true;
        this.rightButton.alpha = 0.5;

        this.upButton = game.add.sprite(62.5, game.world.height - 128, 'up');
        this.upButton.inputEnabled = true;
        this.upButton.alpha = 0.5;

        this.inputChanged = false;

        this.turnLeft = false;
        this.turnRight = false;
        this.moveUp = false;
        this.leftButton.events.onInputDown.add(function (e) {
            this.turnLeft = true;
            this.turnRight = false;
            this.inputChanged = true;
        }, this);

        this.rightButton.events.onInputDown.add(function (e) {
            this.turnRight = true;
            this.turnLeft = false;
            this.inputChanged = true;
        }, this);

        this.leftButton.events.onInputUp.add(function (e) {
            this.turnLeft = false;
            this.inputChanged = true;
        }, this);

        this.rightButton.events.onInputUp.add(function (e) {
            this.turnRight = false;
            this.inputChanged = true;
        }, this);


        this.upButton.events.onInputDown.add(function (e) {
            currentSpeed = 300;
            this.moveUp = true;
            this.turnRight = false;
            this.turnLeft = false;
            this.inputChanged = true;
        }, this);

        this.upButton.events.onInputUp.add(function (e) {
            this.moveUp = false;
            this.inputChanged = true;
        }, this);





        this.time = 2 * 2;
        this.timerText = game.add.text(game.world.centerX, 25, this.time, { font: "20px monospace", fill: "#fff", align: "center" });
        this.timerText.anchor.setTo(0.5, 0.5);

        this.timer();

        var r = function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        };

        tank.x = r(0, 500);
        tank.y = r(0, 500);


        this.health = 3;

        this.respawningText = game.add.text(game.world.centerX, game.world.centerY, '', { font: "20px monospace", fill: "#0f0", align: "center" });
        this.respawningText.anchor.setTo(0.5, 0.5);
        this.respawningTime = 0;
        this.socket = game.options.socket;
        var that = this;

        this.socket.on('game-progress-update', function (data) {

            data.players.forEach(function(dataPlayer) {
                if (dataPlayer.id !== this.io.engine.id) {
                    console.log('tanks game-progress-update', JSON.stringify(data.players, undefined, 2), this.io.engine.id);
                    enemies[0].setX(dataPlayer.positionX);
                    enemies[0].setY(dataPlayer.positionY);
                    enemies[0].setTurret(dataPlayer.turretAngle);
                    enemies[0].setVelocity(dataPlayer.velocity);
                    enemies[0].setRotation(dataPlayer.rotation);

                    if (dataPlayer.fired) {
                        that.fireEnemy(enemies[0], dataPlayer.bulletSpeedX, dataPlayer.bulletSpeedY);
                    }

                    if (dataPlayer.status === 'respawning') {
                        enemies[0].alive = false;
                    } else if (!enemies[0].alive){
                        enemies[0].alive = true;
                        enemies[0].tank.reset(0, 0);
                        enemies[0].shadow.reset();
                        enemies[0].turret.reset();
                    }
                } else {
                    if (dataPlayer.status === 'respawning' && that.respawningTime === 0) {
                        that.respawningTime = 9;
                        that.respawning();
                    }
                }
            }, this);
        }, this);

        //TODO: server should call when to add coins   
//        coin = game.add.sprite(200, 200, 'coin');
//        game.physics.enable(coin, Phaser.Physics.ARCADE);
//        coin.anchor.setTo(0.5, 0.5);
//        coin.animations.add('spin');
//        coin.animations.play('spin', 15, true);
    },

    update: function() {

        var inputChanged = false;

        game.physics.arcade.overlap(enemyBullets, tank, this.bulletHitPlayer, null, this);
//        game.physics.arcade.overlap(tank, coin, function() {
//            coin.kill();
//        }, null, this);

        for (var i = 0; i < enemies.length; i++)
        {
            if (enemies[i].alive)
            {
                game.physics.arcade.collide(tank, enemies[i].tank);
                game.physics.arcade.overlap(bullets, enemies[i].tank, this.bulletHitEnemy, null, this);
                enemies[i].update();
            }
        }

        if (this.turnLeft)
        {
            tank.angle -= 4;
            inputChanged = true;
        }

        if (this.turnRight)
        {
            tank.angle += 4;
            inputChanged = true;
        }

        if (this.moveUp)
        {
            //  The speed we'll travel at
            currentSpeed = 300;
            inputChanged = true;
        }
        else
        {
            if (currentSpeed > 0)
            {
                currentSpeed -= 4;
                inputChanged = true;
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

        var prevRotation = turret.angle;

        var rot = Phaser.Math.radToDeg(Phaser.Math.angleBetween(0, 0,-this.touchControl.speed.x, -this.touchControl.speed.y));
        turret.angle = rot;

        if (rot !== prevRotation) {
            inputChanged = true;
        }

        var fired = false;
        if (game.input.activePointer.isDown)
        {
            //  Boom!
            fired = this.fire(rot, -this.touchControl.speed.x, -this.touchControl.speed.y);
        }


        if (inputChanged || this.inputChanged || fired) {
            var updateData = {
                positionX: tank.x,
                positionY: tank.y,
                turretAngle: rot,
                fired: fired,
                game: 'tanks',
                velocity: tank.body.velocity,
                rotation: tank.rotation,
                health: this.health,
                bulletSpeedX: -this.touchControl.speed.x,
                bulletSpeedY: -this.touchControl.speed.y
            };

            if (this.time <= 0) {
                updateData.status = 'dead';
            }

            this.socket.emit('player-update', updateData);
            if (this.time <= 0) {
                game.state.start('Over');
            }
        }
    },

    bulletHitPlayer: function(tank, bullet) {
        this.health -= 1;
        bullet.kill();
        if (this.health <= 0) {
            tank.kill();
            shadow.kill();
            turret.kill();
        }

    },

    bulletHitEnemy: function(tank, bullet) {

        bullet.kill();

        var destroyed = enemies[tank.name].damage();

        if (destroyed)
        {
            var explosionAnimation = explosions.getFirstExists(false);
            explosionAnimation.reset(tank.x, tank.y);
            explosionAnimation.play('kaboom', 30, false, true);
        }

    },
    fireEnemy:  function(enemy, x, y) {
        var bullet = enemyBullets.getFirstExists(false);

        bullet.reset(enemy.turret.x, enemy.turret.y);

        bullet.rotation = game.physics.arcade.moveToXY(bullet, x * 100, y * 100, 400);
    },
    fire: function(bulletRotation, x, y) {

        if (game.time.now > nextFire && bullets.countDead() > 0 && this.respawningTime === 0)
        {
            nextFire = game.time.now + fireRate;

            var bullet = bullets.getFirstExists(false);

            bullet.reset(turret.x, turret.y);

            console.log(x, y);
            bullet.rotation = game.physics.arcade.moveToXY(bullet, x * 100, y * 100, 400);
            return true;
        } else {
            return false;
        }
    },

    render: function () {

        game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);

    },
    timer: function () {
        this.time -= 1;

        this.timerText.setText(this.time);

        if (this.time > 0) {
            game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, this.timer, this);
        }
    },
    respawning: function () {
        this.respawningTime -= 1;

        this.respawningText.setText('Respawning in: '  + this.respawningTime);

        if (this.respawningTime > 0) {
            game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, this.respawning, this);
        } else {
            this.health = 3;
            var updateData = {
                positionX: tank.x,
                positionY: tank.y,
                turretAngle: 0,
                fired: false,
                game: 'tanks',
                velocity: tank.body.velocity,
                rotation: tank.rotation,
                health: this.health,
                bulletSpeedX: 0,
                bulletSpeedY: 0,
                status: 'alive'
            };

            this.socket.emit('player-update', updateData);
            tank.reset(0, 0);
            shadow.reset();
            turret.reset();
            this.respawningText.setText('');
        }
    }
};

//@ sourceURL=playTanks.js