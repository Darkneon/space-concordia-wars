(function(window) {    
    // Constructor
    var NewRoom = function(options) {                
        this._$contentElement = $(options.elements.content);           
        this._$nickname = $(options.elements.nickname);
                
        $.get(options.path + '/templates/new-room-form.mark', function(template) {                                
            this._$contentElement.append(template);            
        }.bind(this));            
        
        this._$contentElement.on('submit', '#new-room-form', this.onNewRoomClick.bind(this));
    };
    
    NewRoom.prototype.onNewRoomClick = function(e) {         
        e.preventDefault();
        
        var nickname = this._$nickname.val();
        var that = this;
        
        if (!isNicknameValid(nickname)) {
            alert('Nickname is blank or invalid');
            return false;
        }
        
        var data = { nickname: nickname };
        
        $.post('/newRoom', data, function(result) {
            that._$contentElement.hide();
            console.log(result);
        }, 'json')
        .fail(function() {
            console.error('start-server');
        });
    }
    
    var isNicknameValid = function(nickname) {
        return nickname.trim() !== '';    
    };
    
    window.NewRoom = NewRoom;
})(window);