module.exports = function(){
	var mongoose = require('mongoose'),
		schemas = require(process.cwd() + '/models/schemas'),
		result = {};

	result.connection = mongoose.connect('mongodb://localhost/webl8n');

	result.translationSetModel = mongoose.model('translationSet', schemas.TranslationSetSchema);
	result.translatedValueModel = mongoose.model('translatedValue', schemas.TranslatedValueSchema);
	result.translationModel = mongoose.model('translation', schemas.TranslationSchema);

	return result;
}();