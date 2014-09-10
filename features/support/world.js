module.exports = function() {

  this.World = function World(callback) {
  	var chai = require('chai'),
  		models = require(process.cwd() + '/models/models');
    chai.use(require('chai-things'));
    this.expect = chai.expect;
    this.client = require('restify').createJsonClient({
		url: 'http://localhost:8000'
	});

    this.emptyDatabase = function(cb) {
        models.connection.connection.db.dropDatabase();
        cb();
    };

	this.featureParsing = {
		getTranslationToCreate: function(translationLine){
			var translationRequest = {},
				translationToCreate;
			translationRequest[translationLine.key] = {
				translationSets: translationLine.translationSets.split(','),
				values: {}
			};
			translationToCreate = translationRequest[translationLine.key];

			if(translationLine['en value']){
				translationToCreate.values['en'] = translationLine['en value'];
			}
			if(translationLine['fr value']){
				translationToCreate.values['fr'] = translationLine['fr value'];
			}
			if(translationLine['nl value']){
				translationToCreate.values['nl'] = translationLine['nl value'];
			}
			if(translationLine['ge value']){
				translationToCreate.values['ge'] = translationLine['ge value'];
			}

			return translationRequest;
		},
		checkTranslation: function(actual, expected, world, callback){
			try{
				world.expect(actual).to.be.an('object');
				world.expect(actual).to.have.property(expected.key);
				world.expect(actual[expected.key]).to.be.an('object');
				if(expected['en value']){
					world.expect(actual[expected.key]).to.have.property('en',expected['en value']);
				}
				if(expected['fr value']){
					world.expect(actual[expected.key]).to.have.property('fr',expected['fr value']);
				}
				if(expected['nl value']){
					world.expect(actual[expected.key]).to.have.property('nl',expected['nl value']);
				}
				if(expected['ge value']){
					world.expect(actual[expected.key]).to.have.property('ge',expected['ge value']);
				}
				world.client.get('/api/translationsetnames', function(err, req, res, obj){
					var allTranslationSets = _.map(obj, function (translationSet){
						return translationSet._id;
					});

					if(err) throw err;

					try{
						_.each(expected.translationSets.split(','), function(translationSet){

							var actualTranslationSetFound = _.find(actual[expected.key].translationSets, function (actualTranslationSet)
							{ 
								return _.indexOf(allTranslationSets,actualTranslationSet) !== -1;
							});
							world.expect(actualTranslationSetFound).to.not.be.undefined;
						});						
					}
					catch(err){
						callback(err);
					}
					finally{
						callback();
					}
				});
			}
			catch(err){
				callback(err);
			}
		}
	};

    callback();
  };
}