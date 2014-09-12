(function(window) {        
    var JoinGame = function(elements) {                
        var $button = $(elements.button); 
        this.$modal = $(elements.modalContent);
        $button.on('click touchstart', this.onClick.bind(this));
    }

    JoinGame.prototype.onClick = function() {        
        this.$modal.find('.content').html('<div class="card"><ul class="table-view"><li class="table-view-cell">Item 1</li></ul></div>');
        this.$modal.find('.title').html('List of Rooms');
        
        $.post('/list-games', function(result) { alert(result); })
         .fail(function() { console.error('list-games') });
    }
            
    window.JoinGame = JoinGame;
})(window);
