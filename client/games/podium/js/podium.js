(function() {
    var Podium = function () {
        var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'theGame', { create: create, update: update });
        function create() {

            var winner = game.add.text(game.width / 2, game.height / 2, 'RED Wins!', {fill: '#f00' });
            winner.anchor.setTo(0.5, 0.5);
            winner.font = 'monospace';
            winner.fontSize = '55px';

            var goTeam1 = game.add.text(300, 100, 'Go RED !!!', {fill: '#f00' });
            goTeam1.anchor.setTo(0.5, 0.5);
            goTeam1.font = 'monospace';
            goTeam1.fontSize = '25px';

            var goTeam2 = game.add.text(500, 200, 'Go RED !!!', {fill: '#f00' });
            goTeam2.anchor.setTo(0.5, 0.5);
            goTeam2.font = 'monospace';
            goTeam2.fontSize = '25px';

            var losingTeam = game.add.text(200, 400, 'BLUE you SUCK, go home !!!', {fill: '#00f' });
            losingTeam.anchor.setTo(0.5, 0.5);
            losingTeam.font = 'monospace';
            losingTeam.fontSize = '40px';

            game.add.tween(winner.scale)
                .to({x: 1, y:1}, 500, Phaser.Easing.Linear.None)
                .to({x: 3, y:3}, 500, Phaser.Easing.Linear.None).loop().start();


            game.add.tween(goTeam1.scale)
                .to({x: 1, y:1}, 500, Phaser.Easing.Linear.None)
                .to({x: 1.5, y:1.5}, 500, Phaser.Easing.Linear.None).loop().start();

            game.add.tween(goTeam2.scale)
                .to({x: 1, y:1}, 500, Phaser.Easing.Linear.None)
                .to({x: 1.5, y:1.5}, 500, Phaser.Easing.Linear.None).loop().start();

            game.add.tween(losingTeam)
                .to({x: game.width - 200 }, 3000, Phaser.Easing.Linear.None)
                .to({x: 200}, 3000, Phaser.Easing.Linear.None).loop().start();

            //Registering EPSy plugin
            var epsy = game.plugins.add(Phaser.Plugin.EPSY);
            var config = [{"pos":{"x":200,"y":50},"posVar":{"x":0,"y":0},"speed":180,"speedVar":50,"angle":-0.42402826855123976,"angleVar":-176.81978798586573,"life":4.5,"lifeVar":1,"radius":7,"radiusVar":2,"textureAdditive":false,"startScale":1,"startScaleVar":0,"endScale":2,"endScaleVar":2,"startColor":[255,0,0,1],"startColorVar":[255,0,0,0],"endColor":[255,0,0,1],"endColorVar":[255,0,0,1],"colorList":[],"gravity":{"x":0,"y":-90},"radialAccel":0,"radialAccelVar":0,"tangentialAccel":0,"tangentialAccelVar":0,"totalParticles":283,"emissionRate":132.78798586572438,"xEquation":"","yEquation":"","textureEnabled":true,"active":true,"duration":null,"id":"f","aFactor":{"x":0,"y":0},"xFactor":{"x":0,"y":0},"border":{"top":250.30270906949352,"left":353.35689045936397,"bottom":250.4570082449941,"right":372.20259128386334},"zIndex":0}];

            //creating a particle system from a given configuration
            var particleSystem1 = epsy.loadSystem(config, 200, 200);


            // you can let Phaser add the particle system to world group or choose to add it to a specific group
            var myGroup = game.add.group();

            myGroup.add(particleSystem1);


        }

        function update() {

        }
    };

    window.P = Podium;
})();