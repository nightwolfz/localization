module.exports = function (){
    var _ = require('lodash');
    var result = {},
		models = require(process.cwd() + '/models/models'),
		compacter = require(process.cwd() + '/routes/compacter');
    
    
    /*------------------------------------------
      Return translations as JSON
    -------------------------------------------*/
    result.get = function (req, res, next) {

        var selectedSet = _.uniq(req.params.name.split(','));
        var lastIndex = selectedSet.length - 1;
        var response = {};

        _.each(selectedSet, function (tranSetName, index) {

            var promise = models.translationSetModel.findOne({ name: tranSetName }).exec();

            promise.addBack(function (err, tranSet) {

                var query = models.translationModel.find({ translationSets: { "$in": [tranSet] } });

                query.populate('translationSets').exec(function (erro, translations) {
                    if (erro) next(erro);

                    if (typeof response[tranSetName] == 'undefined') response[tranSetName] = {};
                
                    _.map(translations, function (translation) {
                        response[tranSetName][translation.key] = compacter.compactDocument(translation);
                    }, this);
                    
                    // Once everything's done, send response
                    if (index == lastIndex) res.send(response);
                });

            });

        });

    };
    
    /*------------------------------------------
      Return all translation set names
    -------------------------------------------*/
    result.getNames = function (req, res, next){
		models.translationSetModel.find(null, function (err, translationSets){
            if (err) return next(err);
            res.send(_.uniq(_.pluck(translationSets, 'name')));
		});
	};

	return result;
}();