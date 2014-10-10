var result = {};

result.tokenize = function(username, password) {
    var token = require("crypto").createHmac("md5", username + password).update("Ryan equals life, I'm gonna be his wife").digest("hex");
    return token;
};

module.exports = result;