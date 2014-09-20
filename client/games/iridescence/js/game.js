(function() {
    
    var I = function(options) {
        window.h = 600;
        window.w = 900;

        window.game = new Phaser.Game(w, h, Phaser.CANVAS, 'theGame');


        game.options = options;
        game.state.add('Preload', Game.Preload);
        game.state.add('Load', Game.Load);
        game.state.add('Wait', Game.Wait);
        game.state.add('Play', Game.Play);
        game.state.add('Over', Game.Over);

        game.state.start('Preload');
    };
    
    window.I = I;
})();

//@ sourceURL=game.js