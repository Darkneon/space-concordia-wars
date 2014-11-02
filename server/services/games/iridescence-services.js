var assert = require('assert');

var Platform = function(color, width, height, containsCoin, coinLocation){
    this.color = color;
    this.width = width;
    this.height = height;
    this.containsCoin = containsCoin;
    this.coinLocation = coinLocation;
};

//var platformColors = ["white", "blue", "green", "red"];

var IridescenceServices = function (options) {
    options = options || {};
    this.IRI_BASE_LEVEL_SIZE = 100;
    this.WINDOW_WIDTH = options.w || 900; // The original game uses the value of this parameter to determine width of the platform
    this.WINDOW_HEIGHT = options.h || 600;
    //this.level = [];
};

IridescenceServices.prototype.generatePlatforms = function() {
    var level = [];
    for(var i = 0; i < this.IRI_BASE_LEVEL_SIZE; i++){
        var height = Math.floor(Math.random()*(this.WINDOW_HEIGHT - 300 + 1) + 300) //part of the original code
        //var color = platformColors[Math.floor(Math.random() * (platformColors.length - 1))];
        var color = Math.floor(Math.random() * 4);
        var containsCoin = Math.random() <= 0.3;
        if(containsCoin){
            var coinLocation = Math.floor(Math.random() * this.WINDOW_WIDTH);
            level[i] = new Platform(color, this.WINDOW_WIDTH, height, containsCoin, coinLocation);
        }
        else{
            level[i] = new Platform(color, this.WINDOW_WIDTH, height, containsCoin);
        }
    }

    return level;
};

IridescenceServices.prototype.calculateFinalScore = function(room) {
    var score = { red: 0, blue: 0};
    var highestJump = {height: 0, team: ''};

    Object.keys(room.players).forEach(function(key) {
        var player = room.players[key];
        score[player.team] += player.score;

        if (player.highestJump > highestJump.height) {
            highestJump.height = player.highestJump;
            highestJump.team = player.team;
        }
    });

    var points = { red: 0, blue: 0};
    points[highestJump.team] += 1;

    if (score.red > score.blue) { points['red'] += 1; }
    else if (score.red < score.blue) { points['blue'] += 1; }

    return {
        score: score,
        points: points,
        highestJump: highestJump
    };
};

IridescenceServices.prototype.processPlayerUpdate = function(data, playerId, playerList) {
    if (playerList[playerId]) {
        var playerData = playerList[playerId].data || {};
        playerData.score = data.score;
        playerData.highestJump = data.highestJump;
        playerData.status = data.status;

        playerList[playerId].data = playerData;

        var redScore = 0;
        var blueScore = 0;

        for (var key in playerList) {
            var player = playerList[key];

            assert(player.team === 'red' || player.team === 'blue');
            if (player.data) {
                if (player.team === 'red') { redScore += player.data.score; }
                if (player.team === 'blue') { blueScore += player.data.score; }
            }
        }

        return {
            redScore: redScore,
            blueScore: blueScore
        };
    }

    return null;
};
module.exports = new IridescenceServices();