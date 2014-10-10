require('look').start();

var restify = require('restify'),
    bunyan = require('bunyan'),
    passport = require('passport'),
    UniqueTokenStrategy  = require('passport-unique-token').Strategy,

	app = restify.createServer({
		name: 'translationManager',
		log: bunyan.createLogger({
			name: 'serverLog',
			streams: [
			{
				level: 'error',
				path: process.cwd() + '/log/translationsManager.log'  // log ERROR and above to a file
			}/*,
			{
				level: 'error',
				stream: process.stdout  // log ERROR and above to a file
			}*/]
		})
    }),
    routeAccount = require('./routes/account'),
	routeTranslation = require('./routes/translation'),
    routeTranslationset = require('./routes/translationSet'),
    seed = require('./migrations/seed'),
    models = require('./models/models'),
	mongoose = require('mongoose'),
    hasher = require('./helpers/token');

 
/*---------------------------------
 * Authentication
 *--------------------------------*/
var users = require('./models/users');

var passportTokens = {
    tokenQuery: 'token',
    tokenParams: 'token',
    tokenField: 'token'
};

passport.use(new UniqueTokenStrategy(passportTokens, function (token, done) {
    findByToken({ uniqueToken: token, expireToken: { $gt: Date.now() } }, function (err, user) {

        console.log(user);
        //console.log(token);

        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Unknown user ' + user.username });

        if (hasher.tokenize(user.username, user.password) != token) {
            return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
    });
}));

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) fn(null, users[idx]); else fn(new Error('User ' + id + ' does not exist'));
}

function findByToken(token, fn) {
    for (var i in users) {
        if (hasher.tokenize(users[i].username, users[i].password) === token.uniqueToken) {
            console.log('Token found for: ' + users[i].username);
            return fn(null, users[i]);
        }
    }
    return fn(null, null);
}

function authenticate(req, res, next) {
    console.log('authenticate');////
    console.log(req.params);////
    
    passport.authenticate('token', function (err, user, info) {
        console.log('passport.authenticate');
        if (err) return next(err);
        if (!user) res.send(401, { message: "Incorrect token credentials" });
        req.user = user;
        next();
    });
    next();
}

passport.serializeUser(function (user, done) {console.log('serializeUser');////after sucessful login
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {console.log("deserializeUser");/////after sucessful logout
    findById(id, function (err, user) {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());
//app.use(restify.requestLogger());
app.use(restify.bodyParser());

/*---------------------------------
 * Routes
 *--------------------------------*/
app.get('/api/translationsetnames', authenticate, routeTranslationset.getNames);
app.get('/api/translationset/:name', authenticate, routeTranslationset.get);

app.post('/api/translation', authenticate, routeTranslation.post);
app.post('/api/token', routeAccount.token);
app.post('/api/login', authenticate, routeAccount.login);

app.get('/api/account', authenticate, routeAccount.account);
app.get('/api/logout', routeAccount.logout);

app.get(/\/?.*/, restify.serveStatic({
    directory: './public',
    default: 'index.html'
}));

/*---------------------------------
 * Events
 *--------------------------------*/
app.on('after', restify.auditLogger({
	log: app.log.child({ audit: true })
}));
app.on('uncaughtException', function (req, res, route, err) {
	try {
	    req.log.child({ error: true }).error({err: err });
	}
	finally{
		res.send(err);
	}
});

app.listen(3000, function() {
    console.log('%s listening at %s', app.name, app.url);
});