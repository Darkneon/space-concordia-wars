(function(window) {
    
    // Constructor
    var StartServer = function(elements) {                
        var button = Dom.find(elements.button);                  
        var nickname = Dom.find(elements.nicknames);  
        Dom.addListener(button, 'click', this.onClick);
    };
    
    StartServer.prototype.onClick = function() {
        alert('server-game');
    }
    
    window.StartServer = StartServer;
})(window);