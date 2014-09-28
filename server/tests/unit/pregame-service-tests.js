//game-level ready
//waiting
//start game
//go to next game?

var mocha = require('mocha');
var should = require('should');
var request = require('request');
var PreGameService = require("../../services/pregame-services.js");
var Room = require("../../models/Room.js");

describe('Pregame Services', function (done) {
    var testRoom = null;
    var roomId = 0;
    var player1Id = 0;
    var player2Id = 1;
    testRoom = new Room(roomId);

    beforeEach(function(done) {
        //testRoom = new Room(roomId);
        testRoom.addPlayer(player1Id);
        testRoom.addPlayer(player2Id);
        done();
    });


    afterEach(function(done) {
        testRoom.removePlayer(player1Id);
        testRoom.removePlayer(player2Id);
        done();
    });

    describe('#setPlayerReady', function (done) {
        it('should flag that the player is ready', function (done) {

            var preGameService = new PreGameService({
                events: {
                    onPlayerReadySend: function (error, room, playerId) {
                        room.allPlayersReady().should.be.false;
                        room.players[playerId].isReady.should.be.true;
                        done(error);
                    }
                }
            });
            preGameService.setPlayerReady(testRoom, player1Id);
        });

        it('should start the game when all players are ready', function (done) {

            var preGameService = new PreGameService({
                events: {
                    onAllPlayersReadySend: function(error, room){
                        room.allPlayersReady().should.be.true;
                        done(error);
                    }
                }
            });
            preGameService.setPlayerReady(testRoom, player1Id);
            preGameService.setPlayerReady(testRoom, player2Id);
        });


            /*

             */
            // player1.setReady()
            // player1.getRoom().areAllPlayersReady()

            // var roomId = ...
            //if (rooms[roomId].players[socket.id])
            //onReady (rooms[roomId].players[socket.id].isReady = true;
            //if (rooms[roomId].allPlayersReady == true)
            //  preGameService.StartGame();

    });
});
