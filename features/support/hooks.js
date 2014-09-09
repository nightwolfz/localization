var myHooks = function () {
  this.After(function(callback) {
    this.emptyDatabase(callback);
  });
};

module.exports = myHooks;