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
    var result = new Object(), 
        fileName, 
        fileNameJson, 
        localesPath = path.join(__dirname, '/../locales/');
    
    if (!langSet) {
        var files = fs.readdirSync(localesPath);
        
        for (var f in files) {
            fileName = files[f].replace('.json', '');
            fileNameJson = require(localesPath + files[f]);
            result[fileName] = fileNameJson;
        }
    } 
    else if (langSet.indexOf(',') != -1) {
        var langSets = langSet.split(',');
        
        for (var s in langSets) {
            if (langSets[s] == '') continue;
            result[langSets[s]] = require(localesPath + langSets[s]);
        }
        
    }
    else {
        result[langSet] = require(localesPath + langSet);
    }
    
    return result;
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
};

/*-----------------------------------
 Fetch all translation set names
-----------------------------------*/
helpers.getTranslationSets = function () {
    /*var buffer = '';
    var options = {
        host: 'localhost',
        port: 3000,
        path: '/getTranslationSets'
    };
    var callback = function (response) {
        
        response.on('data', function (chunk) {
            buffer += chunk;
        });
        
        response.on('end', function () {
            console.log(req.data);
            console.log(buffer); //JSON.parse(buffer);
        });
    };
    
    var req = http.request(options, callback).end();*/
    var sets = ['Generic', 'Home'];
    console.log(sets);
    return sets;
};

module.exports = helpers;