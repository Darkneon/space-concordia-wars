Game = {};

Game.Preload = function (game){};
Game.Load = function (game){};

var muteValue = 1

Game.Preload.prototype = {
	preload: function () {
		game.stage.backgroundColor = '#000';	
		game.load.image('loading', game.options.path + '/assets/loading.png');
		game.load.image('loadingBorder', game.options.path + '/assets/loadingBorder.png');
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
		
		game.load.audio('intromusic', game.options.path + '/assets/introm.ogg');
		game.load.audio('jump', game.options.path +'/assets/jump.ogg');
		game.load.audio('explode', game.options.path +'/assets/explode.ogg');
		game.load.audio('hit', game.options.path +'/assets/hit.ogg');
		game.load.audio('ost', game.options.path + '/assets/ost.ogg');
		
		game.load.image('player', game.options.path + '/assets/box.png');
		game.load.image('platformR', game.options.path +'/assets/platformR.png');
		game.load.image('platformG', game.options.path +'/assets/platformG.png');
		game.load.image('platformB', game.options.path +'/assets/platformB.png');
		game.load.image('platformN', game.options.path +'/assets/platformN.png');
		game.load.image('platformW', game.options.path +'/assets/platformW.png');
		
		game.load.spritesheet('player', game.options.path +'/assets/playerRGB.png', 54, 52);
		game.load.spritesheet('sc', game.options.path +'/assets/scanline.png', 900, 4);
		game.load.spritesheet('noise', game.options.path +'/assets/noise.png', 450, 300);
		game.load.spritesheet('stars', game.options.path +'/assets/star.png', 5, 5);
		game.load.spritesheet('mute', game.options.path +'/assets/mute.png', 22, 18);


	},
	create: function () {
		game.state.start('Intro');
	}
};