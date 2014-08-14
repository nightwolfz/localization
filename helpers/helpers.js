var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    router = express.Router(),
    helpers = {};

/*-----------------------------------
 Fetch languages from a service
-----------------------------------*/
helpers.getTranslationsBySet = function (langSet) {
    
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

module.exports = helpers;