var mocha = require('mocha');
var should = require('should');
var request = require('request');

var io = require('socket.io-client');

var options ={
    'reconnection delay' : 0
    , 'reopen delay' : 0
    , 'force new connection' : true
};

var player1, player2;

describe('Iridiescence', function (done) {
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

    describe('#player-update', function (done) {
        it('should track the highest jump', function (done) {
            this.timeout(10000);

            player1.on('connect', function() {
                player1.on('roomCreated', function (roomId) {
                    player2.emit('joinRoom', {roomID: roomId, playerID: 'player2'});
                });

                player1.emit('newRoom', {nickname: 'player1' });
            });


            player1.on('game-over-update', function (result) {
                console.log('game-over-update called');
                result.highestJump.should.equal('player1');
                done(null);
            });

            setTimeout(function () {
                player1.emit('player-update', {score: 0, highestJump: 0, status: 'dead'});
                player2.emit('player-update', {score: 0, highestJump: 1, status: 'dead'});
            }, 2000);
        });
    });
/*
    describe('#game-progress-update', function (done) {
        it('should return score for both teams', function (done) {
            var player1 = io.connect('/', options);
            var player2 = io.connect('/', options);

            player1.on('game-progress-update', function (error, result) {
                result.redScore.should.equal(0);
                result.blueScore.should.equal(0);

                player1.removeListener('game-progress-update');

                player1.on('game-progress-update', function (error, data) {
                    result.redScore.should.equal(10);
                    result.blueScore.should.equal(0);
                });

                player2.on('game-progress-update', function (error, data) {
                    result.redScore.should.equal(10);
                    result.blueScore.should.equal(0);
                });

                player1.emit('player-update', {score: 10, highestJump: 0, status: 'alive'});
                player2.emit('player-update', {score: 0, highestJump: 0, status: 'alive'});
            });
        });
    });

    describe('#game-over-update', function (done) {
        it('should return total score for both teams, each player, and distribution of points', function (done) {
            var redPlayer1 = io.connect('/', options);
            var redPlayer2 = io.connect('/', options);

            var bluePlayer3 = io.connect('/', options);
            var bluePlayer4 = io.connect('/', options);


            redPlayer1.emit('player-update', {score: 10, highestJump: 0, status: 'alive'});
            redPlayer2.emit('player-update', {score: 0, highestJump: 0, status: 'alive'});
            bluePlayer3.emit('player-update', {score: 10, highestJump: 0, status: 'alive'});
            bluePlayer4.emit('player-update', {score: 10, highestJump: 0, status: 'alive'});

            redPlayer1.emit('player-update', {score: 20, highestJump: 0, status: 'alive'});
            redPlayer2.emit('player-update', {score: 10, highestJump: 2, status: 'alive'});
            bluePlayer3.emit('player-update', {score: 50, highestJump: 3, status: 'alive'});
            bluePlayer4.emit('player-update', {score: 20, highestJump: 0, status: 'alive'});

            redPlayer1.emit('player-update', {score: 9000, highestJump: 3, status: 'dead'});
            redPlayer2.emit('player-update', {score: 9001, highestJump: 2, status: 'dead'});
            bluePlayer3.emit('player-update', {score: 8000, highestJump: 4, status: 'dead'});
            bluePlayer4.emit('player-update', {score: 20000, highestJump: 0, status: 'dead'});

            redPlayer1.on('game-over-update', function (error, data) {
               data.redScore.should.equal(9000 + 9001);
               data.blueScore.should.equal(8000 + 20000);

               data.highestJump.should.equal('bluePlayer3');
            });
        });
    });*/
});