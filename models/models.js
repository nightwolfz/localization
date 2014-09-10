module.exports = function(){
	var mongoose = require('mongoose'),
        result = {};
    
	result.connection = mongoose.connect('mongodb://localhost/webl8n');

    result.translationSetModel = mongoose.model('translationSet', 
            new mongoose.Schema({
            name: { type: String }
        })
    );

    result.translatedValueModel = mongoose.model('translatedValue', 
        new mongoose.Schema({
            lang : String,
            value : String
        })
    );

    result.translationModel = mongoose.model('translation', 
        new mongoose.Schema({
            translationSet : { type: mongoose.Schema.Types.ObjectId, ref: 'translationSet' },
            key : { type: String, unique: true },
            values : [ result.TranslatedValueSchema ]
        })
    );
    
    // Seed some initial data
    var seed = require(process.cwd() + '/migrations/seed');
    seed(result);

	return result;
}();