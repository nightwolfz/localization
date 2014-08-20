var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

//--------------------------------
// View engine setup
//--------------------------------
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//--------------------------------
// Routes
//--------------------------------
var routes = require('./routes/index');
var lang = require('./routes/lang');

app.use('/', routes);
app.use('/lang', lang);

//--------------------------------
// Error Handlers
//--------------------------------
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//--------------------------------
// Error Handlers (DEV)
//--------------------------------
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//--------------------------------
// Error Handlers (PROD)
//--------------------------------
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

