var _ = require('lodash');
var models = require(process.cwd() + '/models/models'),
	result = {},
	compacter = require(process.cwd() + '/routes/compacter'),
	async = require('async');


/*------------------------------------------
  POST
-------------------------------------------*/
result.post = function (req, res, next) {
	var json = JSON.parse(req.body),
		translationSetFunctions = [],
		translationModel = models.translationModel,
        translationSetModel = models.translationSetModel;

    _.each(json, function (translation, translationKey) {

        var values = translation.values || null;
        var sets = json[translationKey] || [];
        var translationToUpsert = {
            values: values,
            translationSets: []
        };

        _.each(sets.translationSets, function (setName) {
            translationSetFunctions.push(function (callback) {
                translationSetModel.findOneAndUpdate({ name: setName }, { name: setName }, { upsert: true }, function (err, translationSet) {
                    if (err) return callback(err);

                    console.log('Adding set -------------------');
                    console.log(translationSet);
                    console.log('/Adding set ------------------');

                    translationToUpsert.translationSets.push(translationSet._id);
                    

                    callback();
                });
            });
        });
        
        async.parallel(translationSetFunctions, function (err, results){
            if (err) return console.log(err);

            console.log(translationToUpsert);

		    translationModel.update({ key: translationKey }, translationToUpsert, { upsert: true }, function (erro, translationSet){
                if (erro) return console.log(erro);

			    var response = {};
                response[translationKey] = compacter.compactDocument(translationToUpsert);
                
			    res.send(response);
		    });
	    });

    });



    /*_.each(json, function(property) {
        translationToUpsert.key = property;
    });

    var values = json[translationToUpsert.key].values || null;

    _.each(values, function (property) {
        translationToUpsert.values.push({ lang: property, value: values[property] });
    });

	_.each(json[translationToUpsert.key].translationSets, function(setName){
		translationSetFunctions.push(function (callback){
			translationSetModel.findOneAndUpdate({ name: setName }, { name: setName }, {upsert: true}, function (err, translationSet){
				if(err) return console.log(err);

				translationToUpsert.translationSets.push(translationSet._id);
			});
		});
	});

	async.parallel(translationSetFunctions, function (err, results){
		if(err) return console.log(err);

		translationModel.update({ key: translationToUpsert.key }, translationToUpsert, { upsert: true }, function (err, numberOfRecs, translation){
			if(err) return console.log(err);

			var response = {};
			response[translationToUpsert.key] = compacter.compactDocument(translationToUpsert);
			res.send(response);
		});		
	});*/


};
module.exports = result;