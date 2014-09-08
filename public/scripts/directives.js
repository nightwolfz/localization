/*------------------------------------------------------------------------------
 Extend the translate directive
-------------------------------------------------------------------------------*/
angular.module('pascalprecht.translate').directive('translate', [
  '$rootScope',
  '$translate',
  function ($rootScope, $translate) {
    return {
        compile: function (tElement) {
            $rootScope.$on('$translateLoadingSuccess', function () {
                tElement.removeClass($translate.cloakClassName());
            });
            tElement.addClass($translate.cloakClassName());
            tElement.addClass('editable');
        }
    };
}
]);