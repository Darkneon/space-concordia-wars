Game = Game || {};

Game.Wait = function (game){};

//TODO: change namespace name
//TODO: have a common wait state between all games
Game.Wait.prototype = {
	create: function() {
            spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            label2 = game.add.text(w/2,25, 'waiting for players', {fill: '#FDFFC4' });
            label2.anchor.setTo(0.5, 0.5);
            label2.font = 'Press Start 2P';
            label2.fontSize = '25px';
            game.add.tween(label2).to({ alpha: 0.1 }, 500, Phaser.Easing.Linear.None)
            .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None).loop().start();
      }, 
      update: function() {
            if (spaceKey.isDown) {
                  game.state.start('Play');
            }
      }
};
