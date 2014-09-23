(function(window) {
    var load = function(src) {
        var req = new XMLHttpRequest();
        req.open("GET", src, false); // 'false': synchronous.
        req.send(null);

        var headElement = document.getElementsByTagName("head")[0];
        var newScriptElement = document.createElement("script");
        newScriptElement.type = "text/javascript";
        newScriptElement.text = req.responseText;
        headElement.appendChild(newScriptElement);
    };

    var Tanks = function(params) {
        load(params.path + '/js/plugins/phaser-touch-control.js');
        load(params.path + '/js/boot.js');
        load(params.path + '/js/load.js');
        load(params.path + '/js/wait.js');
        load(params.path + '/js/game.js');
        load(params.path + '/js/index.js');
        var t = new T(params);
    };

    window.Tanks = Tanks;
})(window);
