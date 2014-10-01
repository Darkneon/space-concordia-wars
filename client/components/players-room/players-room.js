(function(window) {        
    var PlayersRoom = function(options) {                           
        this._templates = {};
        this._nickname = options.nickname;
        this._roomID = options.roomID;
        this._roomName = options.roomName;
        this._$contentElement = $(options.elements.content);
        this._socket = options.socket;
        
        $.get(options.path + '/templates/room.mark', function(template) {                    
            template = Mark.up(template, {roomName: this._roomName})
            this._templates['room'] = template;
            console.log(options.roomName);
            console.log(this._roomName);
            console.log(this._roomID);
            
            $(options.elements.content).append(template);
            
        }.bind(this));
      
        $.get(options.path + '/templates/current-player.mark', function(template) {                    
            this._templates['current-player'] = template;    
            
            $.get(options.path + '/templates/player.mark', function(template) {        
                this._templates['player'] = template;            
                this.onRoomChanged(options.players);
            }.bind(this));
        
        }.bind(this));
        
      
        this._socket.on('playerJoined', this.onPlayerJoin.bind(this)); 
        this._socket.on('roomChanged', this.onRoomChanged.bind(this));
        
        this._$contentElement.on('click', '#change-team-btn', this.onChangeTeamClick.bind(this));
        //this._$contentElement.on('click', '#start-game-btn', this.onStartGameClick.bind(this));
    }

    PlayersRoom.prototype.onChangeTeamClick = function() { 
        this._socket.emit('changeTeam', { playerID:  this._nickname, roomID: this._roomID});
    }
     
    PlayersRoom.prototype.onPlayerJoin = function(data) { 
        console.log('onPlayerJoin called');
        $('#' + data.team + '-team').after(Mark.up(this._templates['player'], data));
    }
    
    PlayersRoom.prototype.onRoomChanged = function(data) {
        console.log('roomChanged called');
        this._$contentElement.empty();
        this._$contentElement.append(this._templates['room']);
        //$Mark.up(this.templates['room'], {roomName: this._roomName});
        for (var playerID in data) {
            if(data.hasOwnProperty(playerID)){
                var template = data[playerID].nickname === this._nickname ? 'current-player' : 'player';
                $('#' + data[playerID].team + '-team').after(Mark.up(this._templates[template], data[playerID]));
            }
        }
        //}, this);       
    }
            
    window.PlayersRoom = PlayersRoom;
})(window);
