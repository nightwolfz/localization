/*------------------------------------------------------------------------------
 Extend the translate directive (needed for inline editing in the future)
 Change "translateEditable" to "translate" to extend existing directive
-------------------------------------------------------------------------------*/
angular.module('pascalprecht.translate').directive('translateEditable', [
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