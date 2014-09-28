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
                done();
            });

            setTimeout(function () {
                player1.emit('player-update', {score: 0, highestJump: 0, status: 'dead'});
                player2.emit('player-update', {score: 0, highestJump: 1, status: 'dead'});
            }, 500);
        });
    });

    describe('#game-progress-update', function () {
        it('should return score for both teams', function (done) {
            this.timeout(10000);
            var gameProgressUpdateReceived = 0;

            player1.on('connect', function() {
                player1.on('roomCreated', function (roomId) {
                    player2.emit('joinRoom', {roomID: roomId, playerID: 'player2'});
                });

                player1.emit('newRoom', {nickname: 'player1' });
            });

            player1.on('game-progress-update', function (data) {
                data.redScore.should.equal(0);
                data.blueScore.should.equal(20);

                gameProgressUpdateReceived += 1;
                if (gameProgressUpdateReceived === 2) {
                    done();
                }
            });

            player2.on('game-progress-update', function (data) {
                data.redScore.should.equal(0);
                data.blueScore.should.equal(20);

                gameProgressUpdateReceived += 1;
                if (gameProgressUpdateReceived === 2) {
                    done();
                }
            });

            setTimeout(function () {
                player2.emit('player-update', {score: 20, highestJump: 0, status: 'alive'});
            }, 500);

        });
    });

    describe('#game-over-update', function () {
        var player3, player4;

        before(function (done) {
            player3 = io.connect('http://localhost:3000', options);
            player4 = io.connect('http://localhost:3000', options);
            done();
        });

        it('should return total score for both teams, each player, and distribution of points', function (done) {
            // TODO: fix test, it has a race condition, it expects p1 & p3 to be on red and p2 & p4 on blue but it's not alwyas the case
            this.timeout(10000);

            player1.on('connect', function() {
                player1.on('roomCreated', function (roomId) {
                    player2.emit('joinRoom', {roomID: roomId, playerID: 'player2'});
                    player3.emit('joinRoom', {roomID: roomId, playerID: 'player3'});
                    player4.emit('joinRoom', {roomID: roomId, playerID: 'player4'});
                });

                player1.emit('newRoom', {nickname: 'player1' });
            });

           setTimeout(function () {
               player1.emit('player-update', {score: 10, highestJump: 0, status: 'alive'});
               player2.emit('player-update', {score: 0, highestJump: 0, status: 'alive'});
               player3.emit('player-update', {score: 10, highestJump: 0, status: 'alive'});
               player4.emit('player-update', {score: 10, highestJump: 0, status: 'alive'});

               player1.emit('player-update', {score: 20, highestJump: 0, status: 'alive'});
               player2.emit('player-update', {score: 10, highestJump: 2, status: 'alive'});
               player3.emit('player-update', {score: 50, highestJump: 3, status: 'alive'});
               player4.emit('player-update', {score: 20, highestJump: 0, status: 'alive'});

               player1.emit('player-update', {score: 9000, highestJump: 3, status: 'dead'});
               player2.emit('player-update', {score: 9001, highestJump: 2, status: 'dead'});
               player3.emit('player-update', {score: 8000, highestJump: 4, status: 'dead'});
               player4.emit('player-update', {score: 20000, highestJump: 0, status: 'dead'});

               player1.on('game-over-update', function (data) {
                   data.redScore.should.equal(9000 + 8000, 'Red Team Score');
                   data.blueScore.should.equal(9001 + 20000, 'Blue Team Score');
                   data.highestJump.should.equal('player1');
                   done();
               });
           }, 1000);
        });

        after(function (done) {
            player3.disconnect();
            player4.disconnect();
            done();
        });
    });
});