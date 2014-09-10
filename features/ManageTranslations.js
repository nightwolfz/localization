module.exports = function () {

    this.World = require(process.cwd() + '/features/support/world.js').World;
	var _ = require('lodash');

	var translationToCreate = {},
		createdTranslation,
		feature = this;

	this.When(/^I create a translation$/, function (table, callback) {
		var theRow = table.hashes()[0];

		translationToCreate = this.featureParsing.getTranslationToCreate(theRow);

		this.client.post('/api/translation', translationToCreate, function(err, req, res, obj) {
			if(err) return callback(err);
			createdTranslation = obj;
			callback();
		});
	});

	this.Then(/^the translation is part of translation set '(.*)'$/, function (translationSetName, table, callback) {
		var theRow = table.hashes()[0],
			world = this;

	    this.client.get('/api/translationset/' + translationSetName, function(err, req, res, obj) {
	        if (err) return callback(err);

	        world.featureParsing.checkTranslation(obj, table.hashes()[0], world, callback);
	    });
	});	

	this.Then(/^the new translation is returned$/, function (table, callback) {
		this.featureParsing.checkTranslation(createdTranslation, table.hashes()[0], this, callback);
	});	
};

