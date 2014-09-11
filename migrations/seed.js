module.exports = function (schemas) {

    // DO NOT SEED
    return;

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
    //var translatedValueModel = mongoose.model('translatedValue');
    var translationModel = mongoose.model('translation');

    var newSet = new translationSetModel({ name: 'Generic' }); newSet.save();
    var newSet2 = new translationSetModel({ name: 'Home' }); newSet2.save();
    
    /*------------------------------------------
      Generic
    -------------------------------------------*/

    new translationModel({
        translationSets : [newSet], key : 'Title',
        values : {
            'en': 'Translation Manager',
            'fr': 'Gestionnaire de traduction'
        }
    }).save(function (err) { if (err) return handleError(err); });
    
    new translationModel({
        translationSets : [newSet], key : 'ChangeLanguage',
        values : {
            'en': 'Change language',
            'fr': 'Changer de langue'
        }
    }).save(function (err) { if (err) return handleError(err); });
    
    new translationModel({
        translationSets : [newSet], key : 'ChangeTranslationSet',
        values : { 
            'en': 'Translation set',
            'fr': 'Set de traduction'
        }
    }).save(function (err) { if (err) return handleError(err); });

    new translationModel({
        translationSets : [newSet], key : 'Create',
        values : { 
            'en': 'Create',
            'fr': 'Créer'
        }
    }).save(function (err) { if (err) return handleError(err); });
    
    new translationModel({
        translationSets : [newSet], key : 'Save',
        values : { 
            'en': 'Save',
            'fr': 'Sauvegarder'
        }
    }).save(function (err) { if (err) return handleError(err); });
    

    /*------------------------------------------
      Home
    -------------------------------------------*/
    new translationModel({
        translationSets : [newSet, newSet2], key : 'FirstName',
        values : { 
            'en': 'First Name',
            'fr': 'Prénom'
        }
    }).save(function (err) { if (err) return handleError(err); });

    new translationModel({
        translationSets : [newSet, newSet2], key : 'LastName',
        values : { 
            'en': 'LastName',
            'fr': 'Nom'
        }
    }).save(function (err) { if (err) return handleError(err); });

    // Reset collections
    /*var seedData = require(process.cwd() + '/migrations/Generic.json');
    schemas.TranslationSchema.remove().exec()
    .then(function() { return schemas.TranslationSetSchema.remove().exec();})
    .then(function() { return schemas.TranslatedValueSchema.remove().exec();})
    .then(function() { return schemas.TranslationSchema.seed(require('migrations/Generic.json'));})// Seed
    .then(function() { console.log("Added testing data to mongoDb");}, function(err) { return console.error(err);});// Finito!*/

};