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

    var Podium = function(params) {
        load(params.path + '/plugins/EPSY.js');
        load(params.path + '/plugins/EPSY.Phaser.js');
        load(params.path + '/js/podium.js');
        var p = new P(params);
    };

    window.Podium = Podium;
})(window);
