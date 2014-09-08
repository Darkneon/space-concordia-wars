var h = 600;
var w = 900;

var game = new Phaser.Game(w, h, Phaser.AUTO, 'theGame');

game.state.add('Preload', Game.Preload);
game.state.add('Load', Game.Load);
game.state.add('Intro', Game.Intro);
game.state.add('Instructions', Game.Instructions);
game.state.add('Play', Game.Play);
game.state.add('Over', Game.Over);

game.state.start('Preload');
