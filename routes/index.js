var express = require('express'),
    path = require('path'),
    helper = require('./../helpers/helpers'),
    router = express.Router();

/*-----------------------------------
HOME
-----------------------------------*/
router.get('/', function (req, res) {
    console.log(helper);
    res.locals.allLanguages = helper.getTranslationsBySet();
    res.render('index', { title: 'Express', translationSet: '' });
});

router.get('/edit/:translationSet', function (req, res) {
    console.log(helper);
    res.locals.allLanguages = helper.getTranslationsBySet(req.params.translationSet);
    res.render('index', { title: 'Express', translationSet: req.params.translationSet });
});

module.exports = router;
