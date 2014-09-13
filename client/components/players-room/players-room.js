(function(window) {        
    var PlayersRoom = function(options) {                           
        this._templates = {};
        this._nickname = options.nickname;
        this._$contentElement = $(options.elements.content);
        this._socket = options.socket;
        
        $.get(options.path + '/templates/room.mark', function(template) {                    
            this._templates['room'] = template;        
            $(options.elements.content).append(template);
        }.bind(this));
      
        $.get(options.path + '/templates/current-player.mark', function(template) {                    
            this._templates['current-player'] = template;             
        }.bind(this));
        
        $.get(options.path + '/templates/player.mark', function(template) {        
            this._templates['player'] = template;            
            this.onRoomChanged(options.players);
        }.bind(this));
        
        this._socket.on('playerJoined', this.onPlayerJoin.bind(this)); 
        this._socket.on('roomChanged', this.onRoomChanged.bind(this));                 
    }

    PlayersRoom.prototype.onChangeTeamClick = function() { 
        this._socket.emit('changeTeam');
    }
     
    PlayersRoom.prototype.onPlayerJoin = function(data) { 
        console.log('onPlayerJoin called');
        $('#' + data.team + '-team').after(Mark.up(this._templates['player'], data));
    }
    
    PlayersRoom.prototype.onRoomChanged = function(data) {
        console.log('roomChanged called');
        this._$contentElement.empty();
        this._$contentElement.append(this._templates['room']);        
        data.forEach(function(player) {
            var template = player.nickname === this._nickname ? 'current-player' : 'player';
            $('#' + player.team + '-team').after(Mark.up(this._templates[template], player));
        }, this);        
    }
            
    window.PlayersRoom = PlayersRoom;
})(window);
