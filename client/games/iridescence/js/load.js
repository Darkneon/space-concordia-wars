Game = {};

Game.Preload = function (game){};
Game.Load = function (game){};

var muteValue = 1

Game.Preload.prototype = {
	preload: function () {
		game.stage.backgroundColor = '#000';	
		game.load.image('loading', 'assets/loading.png');
		game.load.image('loadingBorder', 'assets/loadingBorder.png');
	},
	create: function() {
		this.game.state.start('Load');
	}
};

Game.Load.prototype = {
	preload: function () {
	    game.stage.backgroundColor = '#000';
		
		loadingbarBorder = game.add.sprite(w/2, h/2+15, 'loadingBorder');
		loadingbarBorder.x -= loadingbarBorder.width/2;
		loadingbar = game.add.sprite(w/2, h/2+19, 'loading');
		loadingbar.x -= loadingbar.width/2;
		game.load.setPreloadSprite(loadingbar);
		
		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		
		game.load.audio('intromusic', 'assets/introm.ogg');
		game.load.audio('jump', 'assets/jump.ogg');
		game.load.audio('explode', 'assets/explode.ogg');
		game.load.audio('hit', 'assets/hit.ogg');
		game.load.audio('ost', 'assets/ost.ogg');
		
		game.load.image('player', 'assets/box.png');
		game.load.image('platformR', 'assets/platformR.png');
		game.load.image('platformG', 'assets/platformG.png');
		game.load.image('platformB', 'assets/platformB.png');
		game.load.image('platformN', 'assets/platformN.png');
		game.load.image('platformW', 'assets/platformW.png');
		
		game.load.spritesheet('player', 'assets/playerRGB.png', 54, 52);
		game.load.spritesheet('sc', 'assets/scanline.png', 900, 4);
		game.load.spritesheet('noise', 'assets/noise.png', 450, 300);
		game.load.spritesheet('stars', 'assets/star.png', 5, 5);
		game.load.spritesheet('mute', 'assets/mute.png', 22, 18);


	},
	create: function () {
		game.state.start('Intro');
	}
};