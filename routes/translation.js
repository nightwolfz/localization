var _ = require('lodash');
var models = require(process.cwd() + '/models/models'),
	result = {},
	compacter = require(process.cwd() + '/routes/compacter'),
	async = require('async');


/*------------------------------------------
  POST
-------------------------------------------*/
result.post = function (req, res, next) {
	var translationToUpsert = { 
			values: [],
			translationSets: []
		},
		keyName,
		translationSetCreations = [],
		translationModel = models.translationModel,
		translationSetModel = models.translationSetModel;

	for(property in req.body){
		if(req.body.hasOwnProperty(property)){
			translationToUpsert.key = property;
		}
	}
	if(req.body[translationToUpsert.key].values){
		var values = req.body[translationToUpsert.key].values;
		for(property in values){
			if(values.hasOwnProperty(property)){
				translationToUpsert.values.push({lang: property, value: values[property]});
			}
		}			
	}

	_.each(req.body[translationToUpsert.key].translationSets, function(translationSetName){
		translationSetCreations.push(function (callback){
			translationSetModel.findOneAndUpdate({ name: translationSetName }, { name: translationSetName }, {upsert: true}, function (err, translationSet){
				if(err) return callback(err);

				translationToUpsert.translationSets.push(translationSet._id);
				callback();
			});
		});
	});

	async.parallel(translationSetCreations, function (err, results){
		if(err) return next(err);

		translationModel.update({ key: translationToUpsert.key }, translationToUpsert, { upsert: true }, function (err, numberOfRecs, translation){
			if(err) return next(err);

			var response = {};
			response[translationToUpsert.key] = compacter.compactDocument(translationToUpsert);
			res.send(response);
			next();
		});		
	});


};
module.exports = result;