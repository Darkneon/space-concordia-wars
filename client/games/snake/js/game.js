(function() {

    var SnakeGame = function(options) {
        window.h = 500;
        window.w = 600;

        window.game = new Phaser.Game(w, h, Phaser.CANVAS, 'theGame');

    console.log(options);
        game.options = options;
        game.state.add('Boot', Game.Boot);
        game.state.add('Load', Game.Load);
        game.state.add('Wait', Game.Wait);
        game.state.add('Play', Game.Play);

        game.state.start('Boot');
    };

    window.SnakeGame = SnakeGame;
})();
