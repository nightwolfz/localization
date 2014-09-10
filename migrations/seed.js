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
    var translatedValueModel = mongoose.model('translatedValue');
    var translationModel = mongoose.model('translation');

    var newSet = new translationSetModel({ name: 'Generic' }); newSet.save();
    var newSet2 = new translationSetModel({ name: 'Home' }); newSet2.save();
    
    /*------------------------------------------
      Generic
    -------------------------------------------*/

    new translationModel({
        translationSet : newSet, key : 'Title',
        values : [ 
            new translatedValueModel({lang : 'en', value : 'Translation Manager'}),
            new translatedValueModel({lang : 'fr', value : 'Gestionnaire de traduction'})
        ]
    }).save(function (err) { if (err) return handleError(err); });
    
    new translationModel({
        translationSet : newSet, key : 'ChangeLanguage',
        values : [ 
            new translatedValueModel({ lang : 'en', value : 'Change language' }),
            new translatedValueModel({ lang : 'fr', value : 'Changer de langue' })
        ]
    }).save(function (err) { if (err) return handleError(err); });
    
    new translationModel({
        translationSet : newSet, key : 'ChangeTranslationSet',
        values : [ 
            new translatedValueModel({ lang : 'en', value : 'Translation set' }),
            new translatedValueModel({ lang : 'fr', value : 'Set de traduction' })
        ]
    }).save(function (err) { if (err) return handleError(err); });

    new translationModel({
        translationSet : newSet, key : 'Create',
        values : [ 
            new translatedValueModel({ lang : 'en', value : 'Create' }),
            new translatedValueModel({ lang : 'fr', value : 'Créer' })
        ]
    }).save(function (err) { if (err) return handleError(err); });
    
    new translationModel({
        translationSet : newSet, key : 'Save',
        values : [ 
            new translatedValueModel({ lang : 'en', value : 'Save' }),
            new translatedValueModel({ lang : 'fr', value : 'Sauvegarder' })
        ]
    }).save(function (err) { if (err) return handleError(err); });
    

    /*------------------------------------------
      Home
    -------------------------------------------*/
    new translationModel({
        translationSet : newSet2, key : 'FirstName',
        values : [ 
                new translatedValueModel({ lang : 'en', value : 'First Name' }),
                new translatedValueModel({ lang : 'fr', value : 'Prénom' })
            ]
    }).save(function (err) { if (err) return handleError(err); });

    new translationModel({
        translationSet : newSet2, key : 'LastName',
        values : [ 
                new translatedValueModel({ lang : 'en', value : 'LastName' }),
                new translatedValueModel({ lang : 'fr', value : 'Nom' })
            ]
    }).save(function (err) { if (err) return handleError(err); });

    new translationModel({
        translationSet : newSet2, key : 'NestedTestString',
        values : [ 
                new translatedValueModel({ lang : 'en', value : "Bold <b>Hello</b>, what's your {{Home.FirstName}} ?" }),
                new translatedValueModel({ lang : 'fr', value : "Gros <b>Bonjour</b>, quel est votre {{Home.FirstName}} ?" })
            ]
    }).save(function (err) { if (err) return handleError(err); });

    // Reset collections
    /*var seedData = require(process.cwd() + '/migrations/Generic.json');
    schemas.TranslationSchema.remove().exec()
    .then(function() { return schemas.TranslationSetSchema.remove().exec();})
    .then(function() { return schemas.TranslatedValueSchema.remove().exec();})
    .then(function() { return schemas.TranslationSchema.seed(require('migrations/Generic.json'));})// Seed
    .then(function() { console.log("Added testing data to mongoDb");}, function(err) { return console.error(err);});// Finito!*/

};