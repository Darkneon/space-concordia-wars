var mocha = require('mocha');
var should = require('should');
var request = require('request');
var Room = require("../../models/Room.js");



describe('Room', function (done) {
    describe('GET Rooms', function (done) {
        it.skip('should return [] when there are no rooms', function (done) {
            request.get('http://localhost:3000/room', function(error, response, body) {
                response.should.be.json;
                var result = JSON.parse(body);
                result.should.be.Array;
                result.should.have.length(0);
                done(error);
            });
        });
    });

    //game-level ready
    //start game
    //go to next game

});


