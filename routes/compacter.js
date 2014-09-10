var result = {},
    _ = require('lodash');

result.compactDocument = function(translationDoc){
    var theTranslation = {};

    _.each(translationDoc.values,function(translatedValue){
		theTranslation[translatedValue.lang.toLowerCase()] = translatedValue.value;
	}, this);
	theTranslation.translationSets = translationDoc.translationSets;
	
	return theTranslation;
};


result.compressDocument = function (translationDoc) {
    var theTranslation = {
        translationSets: [translationDoc.translationSet.name],
        values: {}
    };
    
    _.each(translationDoc.values, function (translatedValue) {
        theTranslation.values[translatedValue.lang.toLowerCase()] = translatedValue.value;
    }, this);
    
    //console.log('------------------------------');
    //console.log(theTranslation);
    
    return theTranslation;
};

module.exports = result;