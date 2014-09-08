(function(window) {
    
    // Constructor
    var JoinGame = function(elements) {                
        var button = Dom.find(elements.button);                  
        Dom.addListener(button, 'click', this.onClick);
    };
    
    JoinGame.prototype.onClick = function() {
        alert('join-game');
    }
    
    window.JoinGame = JoinGame;
})(window);