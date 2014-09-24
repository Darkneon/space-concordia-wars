(function(window) {        
    var JoinRoom = function(options) {                     
        this._templatesCache = {};  
        this._$contentElement = $(options.elements.content);
        this._$nickname = $(options.elements.nickname);
        this._$modalElement = $(options.elements.modal);
        this._onJoined = options.onJoined;
        this._socket = options.socket;
        
        $.get(options.path + '/templates/join-room-button.mark', function(template) {                                
            this._templatesCache['join-room-button'] = template;
            this._$contentElement.append(template);
        }.bind(this));
                                
        $.get(options.path + '/templates/modal-content.mark', function(template) {  
            this._templatesCache['modal-content'] = template;
            this._$modalElement.append(template);
        }.bind(this)); 
        
        $.get(options.path + '/templates/room.mark', function(template) {                                
            this._templatesCache['room'] = template;            
        }.bind(this)); 
        
        $.get(options.path + '/templates/rooms-list.mark', function(template) {                                
            this._templatesCache['rooms-list'] = template;            
        }.bind(this)); 

        // Button that show list of rooms
        this._$contentElement.on('click touchstart', '#join-room-btn', this.onJoinRoomClick.bind(this));

        // Button on each room to join that room
        this._$modalElement.on('click touchstart', '.room > .btn', this.onJoinClick.bind(this));
        
        this._socket.on('allRooms', this.onGetAllRooms.bind(this));
        this._socket.on('joinError', this.onJoinError.bind(this));
        this._socket.on('roomJoined', this.onRoomJoined.bind(this));
    };
   
    JoinRoom.prototype.onJoinRoomClick = function() {                
        this._socket.emit('getAllRooms');
        /*
        var that = this;
        this._$modalElement.find('.content').html(this._templatesCache['rooms-list']);
        $.get('/getRooms', function(result) {
            result.forEach(function(room) {
                if (!room) { return; } //TODO: getting nulls in result, understand why
                
                var template = that._templatesCache['room'];
                var data = {
                    id: room.id,
                    players: room.players.length,
                    capacity: room.roomCapacity
                };
                
                $('#rooms-list').append($(Mark.up(template, data)));            
            });                            
        })
        .fail(function() { 
            console.error('list-games') 
        });
        */
    };
    
    //TODO: We get all the rooms before validating the nickname. Validation only happens on room joining. This (probably) shouldn't be the case.
    JoinRoom.prototype.onGetAllRooms = function(result) {
        var that = this;
        this._$modalElement.find('.content').html(this._templatesCache['rooms-list']);
        result.forEach(function(room) {
            if (!room) { return; }
            //console.log(room);

            var template = that._templatesCache['room'];
            var data = {
                id: room.id,
                players: room.players.length,
                capacity: room.roomCapacity
            };

            $('#rooms-list').append($(Mark.up(template, data)));            
        });                            
    };
    
    JoinRoom.prototype.onRoomJoined = function (result) {  
        this._$modalElement.hide();
        this._onJoined(result.roomID, result.playerID);
        console.log('join room');
    };
    
    JoinRoom.prototype.onJoinError = function (result) {
        alert(result.error);
    };

    JoinRoom.prototype.onJoinClick = function(e) {
        console.log('onJoinClicked');
        var data = {
            roomID: e.target.getAttribute('data-room-id'),
            playerID: this._$nickname.val()
        };
        
        this._socket.emit("joinRoom", data);
        /*
        var that = this;
        var data = {
            roomID: e.target.getAttribute('data-room-id'),
            playerID: this._$nickname.val()
        };

        $.post('/joinRoom', data,  function(result) {
            that._$modalElement.hide();
            that._onJoined(data.roomID, data.playerID);
            console.log('join room');
        })
        .fail(function() {
            console.error('list-games')
        });
        */
    };

            
    window.JoinRoom = JoinRoom;
})(window);
