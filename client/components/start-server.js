(function(window) {    
    // Constructor
    var StartServer = function(elements) {                
        var button = $(elements.button);                  
        var nickname = $(elements.nicknames);  
        button.on('click touchstart', this.onClick);
    };
    
    StartServer.prototype.onClick = function() {
        $.post('/newRoom', function(result) { console.log(result); })
         .fail(function() { console.error('start-server') });
    }
    
    window.StartServer = StartServer;
})(window);