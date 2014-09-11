﻿app.controller('langController', function langController($scope, $http, $cookies, $location, $translate, TranslationFactory) {
    
    
    
    
    /*------------------------------------------
       Add translation set
    -------------------------------------------*/
    $scope.translator.add = TranslationFactory.add;
    
    /*------------------------------------------
       Remove translation set
    -------------------------------------------*/
    $scope.translator.remove = TranslationFactory.remove;

    /*------------------------------------------
       Enable/disable a field
    -------------------------------------------*/
    $scope.translator.enable = TranslationFactory.enable;
    
    /*------------------------------------------
      Flatten multidimensional array to single
    -------------------------------------------*/
    $scope.translator.refresh = function () {
        $scope.translator.table = TranslationFactory.refresh($scope.translator);
    };
    
    /*------------------------------------------
      Refresh on page load
    -------------------------------------------*/
    $scope.$watch('translator.data', function (newValue, oldValue) {
        if (newValue != oldValue) $scope.translator.refresh();
    });

    /*------------------------------------------
       Update a translation value
    -------------------------------------------*/
    $scope.translator.send = TranslationFactory.send;
    
    /*------------------------------------------
       Fetch the translation set from service
    -------------------------------------------*/
    $scope.$watch('translator.selectedSet', function (newValue, oldValue) {

        // Ignore initial setup.
        if (newValue == oldValue) return;

        // Reload data from service
        $translate.refresh();

        // Update translation editor
        $scope.translator.selectedSet = newValue;
        //$scope.translator.refresh();
    });
    
    $scope.$watch('language.current', function (newValue, oldValue) {
        
        // Ignore initial setup.
        if (newValue == oldValue) return;
        
        $translate.use($scope.language.current);
        $cookies.locale = $scope.language.current;
        
        // Reload data from service
        //$translate.refresh();
    });

});