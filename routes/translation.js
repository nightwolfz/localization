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
    
    // For each translation posted
    _.each(json, function (translation, translationKey) {
        
        var response = {};
        var sets = json[translationKey] || [];
        var translationToUpsert = {
            values: translation.values || null,
            translationSets: []
        };
        
        // Upsert translationSets if there's a new value
        _.each(sets.translationSets, function (setName) {
            translationSetFunctions.push(function (callback) {
                translationSetModel.findOneAndUpdate({ name: setName }, { name: setName }, { upsert: true }, function (err, translationSet) {
                    if (err) return callback(err);
                    translationToUpsert.translationSets.push(translationSet._id);
                    callback();
                });
            });
        });
        
        // Update all  keys in parallel, send json output when done
        async.parallel(translationSetFunctions, function (err, results){
            if (err) return console.log(err);

		    translationModel.update({ key: translationKey }, translationToUpsert, { upsert: true }, function (erro, translationSet){
                if (erro) return next(erro);

                response[translationKey] = compacter.compactDocument(translationToUpsert);
			    res.send(response);
		    });
	    });

    });

};
module.exports = result;