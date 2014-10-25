(function (window) {
    // Constructor
    var NicknameScreen = function (options) {
        this._$contentElement = $(options.elements.content);
        this._$nickname = $(options.elements.nickname);
        this._$hiddenContentElement = $(options.elements.hiddenContent);

        $.get(options.path + '/templates/nickname-screen.mark', function (template) {
            var data = {
                nickname: options.debug ? Math.floor((Math.random() * 1000000) + 1) : ''
            };

            this._$contentElement.append($(Mark.up(template, data)));
        }.bind(this));

        this._$contentElement.on('click touchstart', '#begin', function(e) {
            var nickname = $('#nickname').val();
            if (isNicknameValid(nickname)) {
                this._$contentElement.hide();
                this._$hiddenContentElement.show();
            }
        }.bind(this));
    };

    var isNicknameValid = function (nickname) {
        return !(nickname.trim() === '');
    };

    window.NicknameScreen = NicknameScreen;
})(window);