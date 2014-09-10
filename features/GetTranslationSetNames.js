module.exports = function (){

	var translationSetNames,
		_ = require('underscore'),
        async = require('async');

	this.World = require(process.cwd() + '/features/support/world.js').World;
	this.Given(/^translation sets$/, function (table, callback) {
		var translationSetToCreate,
			world = this,
			translationSetCreations = [];
		_.each(table.hashes(), function (translationSetLine){
			translationSetToCreate = {
				dummy: {
					translationSets: [translationSetLine['translation set']],
					values: {}
				}
			};			
			translationSetCreations.push(function (translationSetRequestCallback){
				world.client.post('/api/translation', translationSetToCreate, function (err, req, res, obj) {
					if(err) return translationSetRequestCallback(err);
					translationSetRequestCallback();
				});	
			});	
		});

		async.parallel(translationSetCreations, function(err, results){
			if(err) callback(err);
			callback();
		});
	});

	this.When(/^I request the translations set names$/, function (callback) {
	  	this.client.get('/api/translationsetnames', function (err, req, res, obj){
			if(err) callback(err);

			translationSetNames = obj;

			callback();
		});
	});

	this.Then(/^I get the translation set names$/, function (table, callback) {
		var world = this;
		try{
			_.each(table.hashes(), function (translationSetLine){
				var translationSetExpectedName = translationSetLine['translation set'],
					foundTranslationSet = _.find(translationSetNames, function (translationSetName){
						return translationSetName.name === translationSetExpectedName;
					});
				world.expect(translationSetNames).to.not.be.undefined;
			});			
		}
		catch(err){
			callback(err);
		}
		finally{
			callback();	
		}
	});
};
