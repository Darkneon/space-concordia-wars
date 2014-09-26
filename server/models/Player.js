function Player(nickname) {
    this.id = nickname;
    this.nickname = nickname;
    this.team = 'red';
    this.score = -1;
    this.isReady = false;
}

Player.prototype.reset = function () {
    this.team = "red";
    this.score = -1;
};

Player.prototype.switchTeams = function () {
    this.team = this.team === "red" ? "blue" : "red";
};

module.exports = Player;