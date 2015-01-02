var STATUS = {
    NOT_READY: 0,
    READY: 1,
    IN_GAME: 2,
    DEAD: 3

};

function Player(id, nickname) {
    this.id = id;
    this.nickname = nickname;
    this.joinedRoom = null;
    this.reset();
}

Player.prototype.setReady = function () {
    this.status = STATUS.READY;
};

Player.prototype.setDead = function () {
    this.status = STATUS.DEAD;
};


Player.prototype.reset = function () {
    this.team = "red";
    this.score = -1;
    this.data = {};
    this.status = STATUS.NOT_READY;
};

Player.prototype.switchTeams = function () {
    this.team = this.team === "red" ? "blue" : "red";
};

Player.STATUS = STATUS;

module.exports = Player;