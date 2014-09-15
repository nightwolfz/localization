module.exports = function (){
    var action = {},
        response = {},
        _ = require('lodash'),
        async = require('async'),
		models = require(process.cwd() + '/models/models'),
		compacter = require(process.cwd() + '/routes/compacter');
    
    
    var getTranslationsBySet = function (setName, next) {
        
        models.translationSetModel.findOne({ name: setName }).exec(function (err, tranSet) {
            if (err) next(err);
            
            var query = models.translationModel.find({ translationSets: { "$in": [tranSet] } });
            
            query.populate('translationSets').exec(function (erro, translations) {
                if (erro) next(erro);
                
                if (!response.hasOwnProperty(setName)) response[setName] = {};
                
                _.map(translations, function (translation) {
                    response[setName][translation.key] = compacter.compactDocument(translation);
                });
                
                next();
            });

        });
    };

    
    /*------------------------------------------
      Return translations as JSON
    -------------------------------------------*/
    action.get = function (req, res, next) {

        var selectedSets = _.uniq(req.params.name.split(','));
        
        async.each(selectedSets, getTranslationsBySet, function (err) {
            return err ? next(err) : res.send(response);
        });

    };
    
    /*------------------------------------------
      Return all translation set names
    -------------------------------------------*/
    action.getNames = function (req, res, next){
		models.translationSetModel.find(null, function (err, translationSets){
            if (err) return next(err);
            res.send(_.uniq(_.pluck(translationSets, 'name')));
		});
	};

	return action;
}();