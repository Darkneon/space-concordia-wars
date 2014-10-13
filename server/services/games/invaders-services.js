var assert = require('assert');

var InvadersServices = function (options) {
    options = options || {};
};

InvadersServices.prototype.calculateFinalScore = function(room) {
    var score = { red: 0, blue: 0};

    Object.keys(room.players).forEach(function(key) {
        var player = room.players[key];
        score[player.team] += player.score;
    });

    var points = { red: 0, blue: 0};

    if (score.red > score.blue) { points['red'] += 1; }
    else if (score.red < score.blue) { points['blue'] += 1; }

    return {
        score: score,
        points: points
    };
};

InvadersServices.prototype.processPlayerUpdate = function(data, playerId, playerList) {
    if (playerList[playerId]) {
        console.log('InvadersServices.processPlayerUpdate received');
        var playerData = playerList[playerId].data || {};
        playerData.positionX = data.positionX;
        playerData.positionY = data.positionY;
        playerData.fired = data.fired || false;
        playerData.score = data.score;
        playerData.status = data.status;

        playerList[playerId].data = playerData;

        var redScore = 0;
        var blueScore = 0;
        var players = [];

        for (var key in playerList) {
            var player = playerList[key];

            assert(player.team === 'red' || player.team === 'blue');
            if (player.data) {
                if (player.team === 'red') { redScore += player.data.score; }
                if (player.team === 'blue') { blueScore += player.data.score; }

                players.push({
                    id: player.id,
                    fired: player.data.fired || false,
                    positionX: player.data.positionX,
                    positionY: player.data.positionY
                    
                });
            }
        }

        console.log({
            redScore: redScore,
            blueScore: blueScore,
            players: players
        });
        
        return {
            redScore: redScore,
            blueScore: blueScore,
            players: players
        };
    }

    return null;
};


module.exports = new InvadersServices();