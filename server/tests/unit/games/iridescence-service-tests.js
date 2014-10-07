//game-level ready
//waiting
//start game
//go to next game?

var mocha = require('mocha');
var should = require('should');
var IridescenceService = require("../../../services/games/iridescence-services");
var Room = require("../../../models/Room.js");

describe('Iridescence Services', function (done) {
    var testRoom = null;
    var roomId = 0;
    var player1Id = 0;
    var player2Id = 1;
    var player3Id = 2;
    var player4Id = 3;

    before(function () {
        testRoom = new Room(roomId);
        testRoom.addPlayer(player1Id);
        testRoom.addPlayer(player2Id);
        testRoom.addPlayer(player3Id);
        testRoom.addPlayer(player4Id);

        testRoom.players[player3Id].switchTeams();
        testRoom.players[player4Id].switchTeams();
    });

    describe('#calculateFinalScore', function (done) {
        it('should calculate a redScore, blueScore, and highestJump', function () {
            testRoom.players[player1Id].score = 100;
            testRoom.players[player2Id].score = 150;
            testRoom.players[player3Id].score = 50;
            testRoom.players[player4Id].score = 50;

            testRoom.players[player1Id].highestJump = 10;
            testRoom.players[player2Id].highestJump = 20;
            testRoom.players[player3Id].highestJump = 30;
            testRoom.players[player4Id].highestJump = 40;

            var iridescenceService = new IridescenceService();
            var expected = {
                points: {red: 1, blue: 1},
                score: {
                    red: testRoom.players[player1Id].score + testRoom.players[player2Id].score,
                    blue: testRoom.players[player3Id].score + testRoom.players[player4Id].score
                },
                highestJump: {height: 40, team: 'blue'}
            };
            var actual = iridescenceService.calculateFinalScore(testRoom);
            actual.should.eql(expected);
        });
    });
});
