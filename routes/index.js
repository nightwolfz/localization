var express = require('express'),
    path = require('path'),
    helper = require('./../helpers/helpers'),
    router = express.Router();

/*-----------------------------------
HOME
-----------------------------------*/
router.get('/', function (req, res) {
    
    // Inject translations to view
    res.locals.allLanguages = helper.getTranslationsLocal();
    
    // Render the view
    res.render('index', { title: 'Express', translationSet: '' });
});

router.get('/edit/:translationSet', function (req, res) {
    
    // Inject translations to view
    res.locals.allLanguages = helper.getTranslationsLocal(req.params.translationSet);
    
    // Render the view
    res.render('index', { title: 'Express', translationSet: req.params.translationSet });
});

router.get('/api', function (req, res) {
    
    // Inject translations to view
    res.locals.allLanguages = helper.getTranslations();
    
    // Render the view
    res.render('index', { title: 'Express', translationSet: '' });
});


module.exports = router;
