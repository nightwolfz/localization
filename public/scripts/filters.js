/*------------------------------------------------------------------------------
 Ryan's little helper (aka Overwrite translation filter, cos screw the rules!)
-------------------------------------------------------------------------------*/
app.filter('localize', ['$parse', '$translate', '$sce', function ($parse, $translate) {
    return function (translationId, interpolateParams, interpolation) {
        if (!window.angular.isObject(interpolateParams)) interpolateParams = $parse(interpolateParams)(this);
        return $translate.instant(translationId + '.values.' + $translate.use(), interpolateParams, interpolation);
    };
}]);