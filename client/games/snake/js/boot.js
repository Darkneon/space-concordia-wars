var Game = {
    timerDelay : 400,   //snake movement delay
    score : 0,          //current score
    highscore : null,   //object to store highscores
    currentMode : 'E',  //current play mode - easy/medium/hard
    trailno : 6,        //length of the trailing snake effect
    textList : null   //object to hold parsed game text
};

Game.Boot = function (game){};

Game.Boot.prototype = {
    preload: function () {
        this.load.image('preloaderBackground',  game.options.path + '/assets/preloadbck.png');
        this.load.image('preloaderBar', game.options.path +  '/assets/preloadbar.png');
        //load all game text from text file to make localization in different games easy
        this.load.text('textList', game.options.path + '/assets/BasicGame.txt');

        //Load the local highscores from the localStorage and if they don't exist (first play) then create them
        var tempString = localStorage.getItem("HS");
        if(tempString!=null){
            //parse cannot handle null
            Game.highscore = JSON.parse(tempString);
        }
        else{
            Game.highscore = {
                E : 0,
                M : 0,
                H : 0
            };
        }

        game.stage.backgroundColor = '#000';
    },
    create: function() {
        //TODO: move to config
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.minWidth = 240;
        game.scale.maxWidth = 640;
        game.scale.minHeight = 170;
        game.scale.maxHeight = 500;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.setScreenSize();

        //parse the game text into the textList object;
        var jsonData = JSON.parse(this.game.cache.getText('textList'));
        Game.textList = jsonData;

        this.game.state.start('Load');
    }
};
