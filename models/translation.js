module.exports = function(){
	var mongoose = require('mongoose'),
		translatedValueSchema = require(process.cwd() + '/models/translatedValue');


	var TranslationSchema = new mongoose.Schema({
		translationSets : [String],
		key : String,
		values : [TranslatedValueSchema]
	});

	return mongoose.model('translation', TranslationSchema);
}();