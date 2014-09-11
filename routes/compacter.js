var result = {},
    _ = require('lodash');

result.compactDocument = function(translationDoc){
    return {
        translationSets: _.pluck(translationDoc.translationSets, 'name'),
        values: translationDoc.values
    };
};

module.exports = result;