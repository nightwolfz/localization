var express = require('express'),
    path = require('path'),
    helper = require('./../helpers/helpers'),
    router = express.Router();

/*-----------------------------------
LANG
-----------------------------------*/
router.get('/', function (req, res) {
    res.json(helper.getTranslationsLocal());
});

router.get('/:sets', function (req, res) {
    res.json(helper.getTranslationsLocal(req.params.sets));
});


module.exports = router;
