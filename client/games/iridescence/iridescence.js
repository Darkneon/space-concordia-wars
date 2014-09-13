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
    }
    
    var Iridescence = function(params) {                      
        load(params.path + '/js/load.js');
        load(params.path + '/js/intro.js');
        load(params.path + '/js/instructions.js');
        load(params.path + '/js/play.js');
        load(params.path + '/js/over.js');
        load(params.path + '/js/game.js');        
        var i = new I(params);
    }
    
    window.Iridescence = Iridescence;
})(window);