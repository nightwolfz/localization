module.exports = function(){
	var mongoose = require('mongoose'),
        result = {};
    
	result.connection = mongoose.connect('mongodb://localhost/webl8n');
    
    // Schemas
    var translationSetSchema = new mongoose.Schema({
        name: { type: String }
    });
    var translationModelSchema = new mongoose.Schema({
        translationSets: [ { type: mongoose.Schema.Types.ObjectId, ref: 'translationSet' } ],
        key: { type: String, unique: true },
        values: Object
    });
    
    // Models: Use these to query mongoDb.
    result.translationSetModel = mongoose.model('translationSet', translationSetSchema);
    result.translationModel = mongoose.model('translation', translationModelSchema);
    
    // Seed some initial data
    var seed = require(process.cwd() + '/migrations/seed');
    seed(result);

	return result;
}();