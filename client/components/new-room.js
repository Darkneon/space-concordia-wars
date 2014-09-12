(function(window) {    
    // Constructor
    var NewRoom = function(elements) {                
        var button = $(elements.button);                  
        var nickname = $(elements.nicknames);  
        button.on('click touchstart', this.onClick);
    };
    
    NewRoom.prototype.onClick = function() {
        $.post('/newRoom', function(result) { console.log(result); })
         .fail(function() { console.error('start-server') });
    }
    
    window.NewRoom = NewRoom;
})(window);