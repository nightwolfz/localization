module.exports = function (){
    var _ = require('lodash');
    var result = {},
		models = require(process.cwd() + '/models/models'),
		compacter = require(process.cwd() + '/routes/compacter');

	result.get = function (req, res, next){
		models.translationSetModel.findOne({ name: req.params.name }, function (err, translationSet){
			if(err) next(err);
            
            
            models.translationModel.find().populate('translationSet').exec(function(err, translations) {
                if (err) next(err);
                
                var translationSetToReturn = {};
                
                _.map(translations, function (translation) {
                    translationSetToReturn[translation.key] = compacter.compressDocument(translation);
                }, this);
                
                console.log('------------------------------');
                console.log(translationSetToReturn);
                res.send(translationSetToReturn);
            });

			/*models.translationModel.find({ translationSet: translationSet._id }, function(err, translations){
				if(err) next(err);

				var translationSetToReturn= {};

                _.map(translations, function (translation){
					translationSetToReturn[translation.key] = compacter.compressDocument(translation);
				}, this);
                
                console.log('------------------------------');
                console.log(translationSetToReturn);
				res.send(translationSetToReturn);
			});*/
		});
    };

    result.getNames = function (req, res, next){

		models.translationSetModel.find(null, function (err, translationSets){
            if (err) return next(err);
            res.send(_.pluck(translationSets, 'name'));
		});
	};

	return result;
}();