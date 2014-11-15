var assert = require('assert');
var coreutil = require('core-util-is');

var Player = require('../models/Player.js');

var PlayerServices = function(options) {
    options = options || {};
    this.playersList = options.playersList || {};
};

PlayerServices.prototype.getPlayersList = function() {
    return this.playersList;
};

PlayerServices.prototype.registerNickname = function(msg, socket) {
    assert(msg && !coreutil.isNullOrUndefined(msg.nickname), 'Msg is missing nickname');

    var nickname = msg.nickname;
    var result = true;
    if (nickname === null || nickname === undefined || nickname.trim() === '') {
        result = false;
    } else {
        for (var recordID in this.playersList) { //not an efficient solution but the number of expected users is very small.
            if (this.playersList.hasOwnProperty(recordID)) {
                if (this.playersList[recordID].nickname === nickname) {
                    result = false;
                    break;
                }
            }
        }
    }

    if (result) {
        this.playersList[socket.id] = new Player(nickname);
    }

    return socket.emit('registerNicknameResult', result);
};

module.exports = PlayerServices;