(function (window) {
    // Constructor
    var NewRoom = function (options) {
        this._$contentElement = $(options.elements.content);
        this._nickname = options.nickname;
        this._onNewRoomCreated = options.onNewRoomCreated;
        
        $.get(options.path + '/templates/new-room-form.mark', function (template) {
            this._$contentElement.append(template);
        }.bind(this));
        
        this._$contentElement.on('submit', '#new-room-form', this.onNewRoomClick.bind(this));
        this._socket = options.socket;
        
        this.onNewRoomClick.bind(this);
        this._socket.on('roomCreated', this.onRoomCreated.bind(this));
    };
    
    NewRoom.prototype.onNewRoomClick = function (e) {
        e.preventDefault();
        
        var data = { nickname: this._nickname };
        this._socket.emit('newRoom', data);
    };
    
    NewRoom.prototype.onRoomCreated = function (result) {
        this._$contentElement.hide();
        this._onNewRoomCreated(result, this._nickname);
    };

    window.NewRoom = NewRoom;
})(window);