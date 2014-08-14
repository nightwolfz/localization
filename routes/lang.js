var express = require('express'),
    path = require('path'),
    helper = require('./../helpers/helpers'),
    router = express.Router();

/*-----------------------------------
LANG
-----------------------------------*/
router.get('/', function (req, res) {
    res.end(helper.getTranslationsBySet());
});

router.get('/:lang', function (req, res) {
    res.end(helper.getTranslationsBySet(req.params.lang));
});


module.exports = router;
