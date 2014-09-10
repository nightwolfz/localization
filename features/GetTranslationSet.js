module.exports = function(){
    this.World = require(process.cwd() + '/features/support/world.js').World;

	var	_ = require('lodash'),
		async = require('async'),
		translationSet;

	this.Given(/^translations$/, function (table, callback) {
		var world = this,
			requests = [];

		_.each(table.hashes(), function (translationLine){
			var translationRequest = world.featureParsing.getTranslationToCreate(translationLine);
			requests.push(function(translationRequestCallback){
				world.client.post('/api/translation', translationRequest, function(err, req, res, obj) {
					if(err) return translationRequestCallback(err);
					translationRequestCallback();
				});
			});
		});

		async.parallel(requests, function(err, results){
			if(err) callback(err);
			callback();
		});
	});

	this.When(/^I get the translations for translation set '(.*)'$/, function (translationSetName, callback) {
		this.client.get('/api/translationset/' + translationSetName,function (err, req, res, obj){
			if(err) callback(err);

			translationSet = obj;

			callback();
	  } );
	});

	this.Then(/^the translations are returned$/, function (table, callback) {
		var world = this,
			checks = [];
		world.expect(Object.keys(translationSet).length).to.equal(table.hashes().length);
		_.each(table.hashes(), function (translationLine){
			checks.push(function (checkCallback){
				world.featureParsing.checkTranslation(translationSet, translationLine, world, checkCallback);
			});
		});

		async.parallel(checks, function(err, results){
			if(err) callback(err);
			callback();
		});
	});
};