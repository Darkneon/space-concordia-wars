(function (window) {

    var NicknameScreen = function (options) {
        this._socket = options.socket;
        this._$contentElement = $(options.elements.content);
        this._$hiddenContentElement = $(options.elements.hiddenContent);

        // To be assigned after the template is loaded
        this._$nickname = null;

        // Caller Callbacks
        this._onNicknameCreated = options.onNicknameCreated;

        loadTemplates.call(this, options);
        initEventHandlers.call(this);
        initSocketsCallbacks.call(this);
    };

    NicknameScreen.prototype.getNickname = function() {
        return this._$nickname.val();
    };

    //-----------------------------------------------------------------------
    // Private
    //-----------------------------------------------------------------------
    var loadTemplates = function (options) {
        $.get(options.path + '/templates/nickname-screen.mark', function (template) {
            var data = {
                nickname: options.debug ? Math.floor((Math.random() * 1000000) + 1) : ''
            };

            this._$contentElement.append($(Mark.up(template, data)));
            this._$nickname = $(options.elements.nickname);
        }.bind(this));
    };

    var initEventHandlers = function () {
        this._$contentElement.on('click touchstart', '#begin', function(e) {
            this._socket.emit('registerNickname', { nickname: this.getNickname()});
        }.bind(this));
    };

    var initSocketsCallbacks = function () {
        this._socket.on('registerNicknameResult', registerNicknameResult.bind(this));
    };

    var registerNicknameResult = function(isNicknameValid) {
        if (!!isNicknameValid) {
            this._$contentElement.hide();
            this._$hiddenContentElement.show();
            this._onNicknameCreated(this.getNickname());
        } else {
            this._$contentElement
                .find('.error')
                .text('Nick is missing or taken')
                .show();
        }
    };

    window.NicknameScreen = NicknameScreen;
})(window);