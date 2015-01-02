var assert = require('assert');
var AbstractGameServices = require('./abstract-game-services.js');


var PodiumServices = function (options) {
    options = options || {};
};

PodiumServices.prototype = Object.create(AbstractGameServices.prototype);

PodiumServices.prototype.init = function () {
};

PodiumServices.prototype.calculateFinalScore = function(room) {
};

PodiumServices.prototype.processPlayerUpdate = function(data, playerId, playerList) {
    return null;
};

module.exports = new PodiumServices();