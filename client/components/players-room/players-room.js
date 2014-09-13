(function(window) {        
    var PlayersRoom = function(options) {                           
        this._templates = {};
        this._nickname = 'Me';
        this._$contentElement = $(options.elements.content);
        this._socket = options.socket;
        
        $.get(options.path + '/templates/room.mark', function(template) {                    
            this._templates['room'] = template;        
            $(options.elements.content).append(template);
        }.bind(this));
      
        $.get(options.path + '/templates/current-player.mark', function(template) {                    
            this._templates['current-player'] = template;        
            $('#' + options.currentPlayer.team + '-team').after(Mark.up(template, options.currentPlayer));
            this._$contentElement.on('click', '#change-team-btn', this.onChangeTeamClick.bind(this));                       
        }.bind(this));
        
        $.get(options.path + '/templates/player.mark', function(template) {        
            this._templates['player'] = template;            
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
        
        data.players.forEach(function(player) {
            var template = player.name === this._nickname ? 'current-player' : 'player';
            $('#' + player.team + '-team').after(Mark.up(this._templates[template], player));
        }, this);        
    }
            
    window.PlayersRoom = PlayersRoom;
})(window);
