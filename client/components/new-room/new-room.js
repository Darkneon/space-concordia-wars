(function (window) {
    // Constructor
    var NewRoom = function (options) {
        this._$contentElement = $(options.elements.content);
       // console.log(this._$contentElement);
        this._$nickname = $(options.elements.nickname);
        this._onNewRoomCreated = options.onNewRoomCreated;
        
        $.get(options.path + '/templates/new-room-form.mark', function (template) {
            this._$contentElement.append(template);
        }.bind(this));
        
        this._$contentElement.on('submit', '#new-room-form', this.onNewRoomClick.bind(this));
        this._socket = options.socket;
        
        this.onNewRoomClick.bind(this);
        this._socket.on('invalidNick', this.onInvalidNick.bind(this));
        this._socket.on('roomCreated', this.onRoomCreated.bind(this));
    };
    
    NewRoom.prototype.onNewRoomClick = function (e) {
        e.preventDefault();
        
        var nickname = this._$nickname.val();
        var that = this;
        
        if (!isNicknameValid(nickname)) {
            alert('Nickname is blank');
            alert(nickname);
            return false;
        }
        
        var data = { nickname: nickname };
        
       /* $.post('/newRoom', data, function(result) {
            that._$contentElement.hide();
            that._onNewRoomCreated(result, that._$nickname.val());
        }, 'json')
        .fail(function() {
            console.error('start-server');
        });
        */
        
        console.log('new room message sent');
        this._socket.emit('newRoom', data);

    };
    
    
    NewRoom.prototype.onRoomCreated = function (result) {
        this._$contentElement.hide();
        console.log(result);
        this._onNewRoomCreated(result, this._$nickname.val())
    };
    
    NewRoom.prototype.onInvalidNick = function (msg) {
        alert('Nickname is blank or already taken');
    };
    
    var isNicknameValid = function (nickname) {
        if (nickname.trim() === '') {
            return false;
        }
        return true;
    };
    
    window.NewRoom = NewRoom;
})(window);