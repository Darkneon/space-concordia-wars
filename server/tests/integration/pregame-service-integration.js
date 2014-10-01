var mocha = require('mocha');
var should = require('should');
var request = require('request');
var PreGameService = require("../../services/pregame-services.js");
var Room = require("../../models/Room.js");
var io = require('socket.io-client');

var options ={
    'reconnection delay' : 0
    , 'reopen delay' : 0
    , 'force new connection' : true
};

var player1, player2;

describe('PreGameServices', function (done) {
    beforeEach(function(done) {
        player1 = io.connect('http://localhost:3000', options);
        player2 = io.connect('http://localhost:3000', options);
        done();
    });

    afterEach(function(done) {
        player1.disconnect();
        player2.disconnect();
        done();
    });

    describe('#game-player-ready', function (done) {
        it('should emit game-player-ready-update when a player is ready', function (done) {
            this.timeout(10000);
            player1.on('connect', function() {
                player1.on('roomCreated', function (roomId) {
                    player2.emit('joinRoom', {roomID: roomId, playerID: 'player2'});
                });

                player1.emit('newRoom', {nickname: 'player1' });
            });


            player1.on('game-player-ready-update', function (result) {
                console.log('game-over-update called');
                true.should.equal(true);
                done();
            });

            setTimeout(function () {
                player1.emit('game-player-ready');
            }, 500);
        });
    });
    
        describe('#game-player-ready', function (done) {
        it('should emit game-start when all the players are ready', function (done) {
            this.timeout(10000);
            player1.on('connect', function() {
                player1.on('roomCreated', function (roomId) {
                    player2.emit('joinRoom', {roomID: roomId, playerID: 'player2'});
                });

                player1.emit('newRoom', {nickname: 'player1' });
            });


            player1.on('game-start', function (result) {
                console.log('game-over-update called');
                true.should.equal(true);
                done();
            });

            setTimeout(function () {
                player1.emit('game-player-ready');
                player2.emit('game-player-ready');
            }, 500);
        });
    });
});