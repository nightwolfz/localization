module.exports = function(schemas) {

    var mongoose = require('mongoose');

    // Enable promises
    mongoose.Model.seed = function (entities) {
        var promise = new mongoose.Promise;
        this.create(entities, function (err) {
            if (err) promise.reject(err); else promise.resolve();
        });
        return promise;
    };


    var translationSetModel = mongoose.model('translationSet');
    var translatedValueModel = mongoose.model('translatedValue');
    var translationModel = mongoose.model('translation');

    var newSet = new translationSetModel({ name: 'Generic' });
    newSet.save();
    
    new translationModel({
        translationSet : newSet,
        key : 'Title',
        values : [ 
            new translatedValueModel({lang : 'en', value : 'Translation Manager'}),
            new translatedValueModel({lang : 'fr', value : 'Gestionnaire de traduction'})
        ]
    }).save(function(err) { if (err) return handleError(err); });

    var newSet2 = new translationSetModel({ name: 'Home' });
    newSet2.save();
    
    new translationModel({
        translationSet : newSet2,
        key : 'FirstName',
        values : [ 
                new translatedValueModel({ lang : 'en', value : 'First Name' }),
                new translatedValueModel({ lang : 'fr', value : 'Prénom' })
            ]
    }).save(function (err) { if (err) return handleError(err);});



    // Reset collections
    /*var seedData = require(process.cwd() + '/migrations/Generic.json');
    schemas.TranslationSchema.remove().exec()
    .then(function() { return schemas.TranslationSetSchema.remove().exec();})
    .then(function() { return schemas.TranslatedValueSchema.remove().exec();})
    .then(function() { return schemas.TranslationSchema.seed(require('migrations/Generic.json'));})// Seed
    .then(function() { console.log("Added testing data to mongoDb");}, function(err) { return console.error(err);});// Finito!*/

};