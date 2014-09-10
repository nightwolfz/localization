require('look').start();

var restify = require('restify'),
    bunyan = require('bunyan'),
	server = restify.createServer({
		name: 'translationManager',
		log: bunyan.createLogger({
			name: 'serverLog',
			streams: [
			{
				level: 'warn',
				path: process.cwd() + '/log/translationsManager.log'  // log ERROR and above to a file
			},
			{
				level: 'warn',
				stream: process.stdout  // log ERROR and above to a file
			}]
		})
	}),
	translationRoutes = require('./routes/translation'),
    translationSetRoutes = require('./routes/translationSet'),
    seed = require('./migrations/seed'),
    models = require('./models/models'),
	mongoose = require('mongoose');

server.use(restify.requestLogger());
server.use(restify.bodyParser());
server.get('/api/translationsetnames', translationSetRoutes.getNames);
server.get('/api/translationset/:name', translationSetRoutes.get);
server.post('/api/translation', translationRoutes.post);
server.get(/\/?.*/, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));

server.on('after', restify.auditLogger({
	log: server.log.child({ audit: true })
}));
server.on('uncaughtException', function (req, res, route, err) {
	try{
		req.log.child({ error: true }).error({ req: req, res: res, route: route, err: err })
	}
	finally{
		res.send(err);
	}
});

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});