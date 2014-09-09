module.exports = function(){
	var mongoose = require('mongoose'),
	result = {};

	result.TranslationSetSchema = new mongoose.Schema({
		name: {type: String }
	});
	result.TranslatedValueSchema = new mongoose.Schema({
		lang : String,
		value : String
	});
	result.TranslationSchema = new mongoose.Schema({
		translationSets : [ {type: mongoose.Schema.Types.ObjectId, ref: 'translationSet'} ],
		key : { type: String, unique: true },
		values : [ result.TranslatedValueSchema ]
	});

	return result;
}();