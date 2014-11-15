var webdriverio = require("webdriverio");

var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

var client = webdriverio.remote(options).init();
var config = {
    url: 'http://localhost:3000'
};

var selectors = {
    beginButton: '#begin',
    newRoomButton: '#new-room-btn',
    joinRoomButton: '#join-room-btn',
    changeTeamButton: '#change-team-btn',
    startGameButton: '#start-game-btn',
    canvas: 'canvas'
};

describe('Room Joiner', function () {
    this.timeout(10 * 60 * 1000);

    before(function (done) {
        client
            .url(config.url, done);
    });

    it('should login', function () {
        client
            .click(selectors.beginButton)
            .pause(1000)
            .click(selectors.joinRoomButton)
            .pause(1000)
            .click('li > button:last-child ')
            .pause(1000)
            .click(selectors.changeTeamButton)
            .pause(1000)
            .click(selectors.startGameButton)
            .pause(1000)
            .moveToObject(selectors.canvas, 100, 100)
            .leftClick()
            .pause(500)
            .moveToObject(selectors.canvas, 100, 100)
            .leftClick()
            .pause(500)
            .moveToObject(selectors.canvas, 100, 100)
            .leftClick()
            .pause(10000);
    });

    after(function (done) {
        client.end(done);
    });
});