var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    router = express.Router(),
    http = require("http"),
    helpers = {};

/*-----------------------------------
 Fetch languages from local files
-----------------------------------*/
helpers.getTranslationsLocal = function (langSet) {
    
    langSet = langSet || false;
    var result = new Object(), fileName, fileNameJson;
    
    if (!langSet) {
        var files = fs.readdirSync(path.join(__dirname, '/../locales/'));
        
        for (f in files) {
            fileName = files[f].replace('.json', '');
            fileNameJson = require(path.join(__dirname, '/../locales/') + files[f]);
            result[fileName] = fileNameJson;
        }
    } else {
        result[langSet] = require(path.join(__dirname, '/../locales/') + langSet);
    }
    
    console.log(result);
    return JSON.stringify(result);
};

/*-----------------------------------
 Fetch languages from a service
-----------------------------------*/
helpers.getTranslations = function() {
    var buffer = '';
    var options = {
        host: 'localhost',
        port: 3000,
        path: '/lang'
    };
    var callback = function(response) {

        response.on('data', function(chunk) {
            buffer += chunk;
        });

        response.on('end', function () {
            console.log(req.data);
            console.log(buffer); //JSON.parse(buffer);
        });
    };
    
    var req = http.request(options, callback).end();
    console.log(req);
};


module.exports = helpers;