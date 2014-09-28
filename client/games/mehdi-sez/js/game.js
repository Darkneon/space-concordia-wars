(function() {

    var MehdiSezGame = function(options) {
        window.h = 600;
        window.w = 900;

        window.game = new Phaser.Game(w, h, Phaser.CANVAS, 'theGame');


        game.options = options;
        game.state.add('Boot', Game.Boot);
        game.state.add('Load', Game.Load);
        game.state.add('Wait', Game.Wait);
        game.state.add('Play', Game.Play);
        game.state.add('Over', Game.Over);

        game.state.start('Boot');
    };

    window.MehdiSezGame = MehdiSezGame;
})();

//@ sourceURL=game.js