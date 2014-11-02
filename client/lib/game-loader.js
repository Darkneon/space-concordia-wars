(function(window) {

    var GameLoader = function (options) {
        this._socket = options.socket;
        this._games = options.games;

        this._socket.on('load-game', function (data) {
            $('body').html('<div id="theGame"></div>');
            var game = this._games[data.currentGame];
            game.options.extra = data.extra;
            new game.constructor(game.options);
        }.bind(this));
    };
    window.GameLoader = GameLoader;
})(window);