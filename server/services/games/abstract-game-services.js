var AbstractGameServices = function () {
    
};

AbstractGameServices.prototype.init = function() {
    throw(new Error("AbstractGameServices.init() : cannot call abstract method"));
};

module.exports = AbstractGameServices;