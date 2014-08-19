var express = require('express'),
    path = require('path'),
    helper = require('./../helpers/helpers'),
    router = express.Router();

/*-----------------------------------
LANG
-----------------------------------*/
router.get('/', function (req, res) {
    res.end(helper.getTranslationsLocal());
});

router.get('/:lang', function (req, res) {
    res.end(helper.getTranslationsLocal(req.params.lang));
});


module.exports = router;
