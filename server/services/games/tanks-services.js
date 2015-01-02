var assert = require('assert');
var AbstractGameServices = require('./abstract-game-services.js');


var TanksServices = function (options) {
    options = options || {};
};

TanksServices.prototype = Object.create(AbstractGameServices.prototype);

TanksServices.prototype.init = function () {

};

TanksServices.prototype.calculateFinalScore = function(room) {
    var kills = { red: 0, blue: 0};

    Object.keys(room.players).forEach(function(key) {
        var player = room.players[key];
        var team = getOppositeTeam(player);
        kills[team] += player.dead;
    });

    var points = { red: 0, blue: 0};

    if (kills.red > kills.blue) { points['red'] += 1; }
    else if (kills.red < kills.blue) { points['blue'] += 1; }

    return {
        score: kills,
        points: points
    };
};

TanksServices.prototype.processPlayerUpdate = function(data, playerId, playerList) {
    if (playerList[playerId]) {
        var playerData = playerList[playerId].data || {};
        playerData.score = data.score;
        playerData.positionX = data.positionX;
        playerData.positionY = data.positionY;

        if (data.status === 'dead') {
            playerList[playerId].setDead();
        } else if (data.health <= 0) {
            playerData.dead = data.dead + 1 || 1;
            data.status = 'respawning';
        }


        playerData.status = data.status;
        playerData.turretAngle = data.turretAngle;
        playerData.velocity = data.velocity;
        playerData.rotation = data.rotation;
        playerData.bulletSpeedX = data.bulletSpeedX;
        playerData.bulletSpeedY = data.bulletSpeedY;
        playerData.fired = data.fired;
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
                    positionY: player.data.positionY,
                    turretAngle: player.data.turretAngle,
                    velocity: player.data.velocity,
                    rotation: player.data.rotation,
                    bulletSpeedX: player.data.bulletSpeedX,
                    bulletSpeedY: player.data.bulletSpeedY,
                    status: player.data.status
                });
            }

            player.data.fired = false;
        }

        console.log(players);

        return {
            redScore: redScore,
            blueScore: blueScore,
            players: players
        };
    }

    return null;
};

var getOppositeTeam = function (player) {
    return player.team === 'red' ? 'blue' : 'red';
};
module.exports = new TanksServices();