module.exports = function(){
	var result = {},
		models = require(process.cwd() + '/models/models'),
		_ = require('underscore'),
		compacter = require(process.cwd() + '/routes/compacter');

	result.get = function (req, res, next){
		models.translationSetModel
			.findOne({ name: req.params.name }, function (err, translationSet){
				if(err) next(err);

			models.translationModel
				.find({ translationSets: translationSet._id }, function(err, translations){
					if(err) next(err);

					var translationSetToReturn= {};

					_.map(translations,function (translation){
						translationSetToReturn[translation.key] = compacter.compactDocument(translation);
					}, this);

					res.send(translationSetToReturn);
					next();
				});

		});
	};
	result.getNames = function (req, res, next){
		models.translationSetModel
			.find({}, function (err, translationSets){
				if(err) return next(err);

				res.send(translationSets);
				next();
			});
	};

	return result;
}();