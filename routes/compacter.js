var result = {},
	_ = require('underscore');

result.compactDocument = function(translationDoc){
	var theTranslation = {};

	_.each(translationDoc.values,function(translatedValue){
		theTranslation[translatedValue.lang.toLowerCase()] = translatedValue.value;
	}, this);
	theTranslation.translationSets = translationDoc.translationSets;
	
	return theTranslation;
};


module.exports = result;