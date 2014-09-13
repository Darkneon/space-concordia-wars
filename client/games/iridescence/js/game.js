(function() {
    
    var I = function(options) {
        window.h = 480;
        window.w = 320;

        window.game = new Phaser.Game(w, h, Phaser.AUTO, 'theGame');

        game.options = options;
        game.state.add('Preload', Game.Preload);
        game.state.add('Load', Game.Load);
        game.state.add('Intro', Game.Intro);
        game.state.add('Instructions', Game.Instructions);
        game.state.add('Play', Game.Play);
        game.state.add('Over', Game.Over);

        game.state.start('Preload');
    };
    
    window.I = I;
})();