var _ = require('lodash');
var models = require(process.cwd() + '/models/models'),
	result = {},
	compacter = require(process.cwd() + '/routes/compacter'),
	async = require('async'),
	token = require(process.cwd() + '/helpers/token'),
    crypto = require("crypto");





/*------------------------------------------
  Login/Account/Logout
-------------------------------------------*/
result.token = function (req, res, next) {
    
    var hash = token.tokenize(req.params.username, req.params.password);
    
    res.send({ 'token': hash });
};

result.login = function (req, res, next) {

    console.log('+++++++++++++');

    res.send(req.user);
};

result.logout = function(req, res) {
    req.logout();
    res.send(200);
};

result.account = function(req, res) {
    res.send(req.user);
};

module.exports = result;