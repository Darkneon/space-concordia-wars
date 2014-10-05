var Platform = function(color, width, height, containsCoin, coinLocation){
    this.color = color;
    this.width = width;
    this.height = height;
    this.containsCoin = containsCoin;
    this.coinLocation = coinLocation;
};

var platformColors = ["white", "blue", "green", "red"];

var IridescenceServices = function (options) {
    options = options || {};
    this.IRI_BASE_LEVEL_SIZE = 100;
    this.WINDOW_WIDTH = options.w || 900; // The original game uses the value of this parameter to determine width of the platform
    this.WINDOW_HEIGHT = options.h || 600;
    this.level = [];
};

IridescenceServices.prototype.generateLevels = function() {

    for(var i = 0; i < this.IRI_BASE_LEVEL_SIZE; i++){
        var height = Math.floor(Math.random()*(this.WINDOW_HEIGHT - 300 + 1) + 300) //part of the original code
        var color = Math.floor(Math.random() * (platformColors.length));
        var containsCoin = Math.random() <= 0.3;
        if(containsCoin){
            var coinLocation = Math.floor(Math.random() * this.WINDOW_WIDTH);
            this.level[i] = new Platform(platformColors[color], this.WINDOW_WIDTH, height, containsCoin, coinLocation);
        }
        else{
            this.level[i] = new Platform(platformColors[color], this.WINDOW_WIDTH, height, containsCoin);
        }
    }

    return this.level;
};