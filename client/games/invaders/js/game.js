(function() {

    var InvadersGame = function(options) {
        window.h = 600;
        window.w = 900;

        window.game = new Phaser.Game(w, h, Phaser.CANVAS, 'theGame');


        game.options = options;
        game.state.add('Boot', Game.Boot);
        game.state.add('Load', Game.Load);
        game.state.add('Wait', Game.Wait);
        game.state.add('Play', Game.Play);

        game.state.start('Boot');
    };

    window.InvadersGame = InvadersGame;
})();

//@ sourceURL=game.js