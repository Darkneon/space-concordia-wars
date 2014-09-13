(function() {    
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
    
    var MehdiSez = function(params) {                      
        load(params.path + '/js/mehdi-sez.js');        
        var m = new M(params);
    }
    
    window.MehdiSez = MehdiSez;
})();