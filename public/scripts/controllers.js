app.controller('langController', function ($scope, $http, $cookies, $location, $translate) {
    /*------------------------------------------
        Add translation set
    -------------------------------------------*/
    $scope.translator.add = function (trans) {
        var index = trans.translationSets.indexOf('');
        if (index == -1) {
            trans.translationSets.push('');
        }
    };
    
    /*------------------------------------------
        Remove translation set
    -------------------------------------------*/
    $scope.translator.remove = function (trans) {
        trans.translationSets = trans.translationSets.filter(function (x) {
            return x != '' && typeof x == 'string';
        });
    };
    
    /*------------------------------------------
        Enable/disable a field
    -------------------------------------------*/
    $scope.translator.enable = function (trans) {
        trans.enabled = !trans.enabled;
    };
    
    /*------------------------------------------
       Flatten multidimensional array to single
    -------------------------------------------*/
    $scope.translator.refresh = function () {
        var single = [];
        debug("Refreshing table " + JSON.stringify($scope.translator.data, null));
        angular.forEach($scope.translator.data, function (trans, cat) {
            
            if ($scope.translator.selectedSet != cat) return;
            
            for (key in trans) {
                single.push({
                    'key': key,
                    'values': trans[key].values,
                    'translationSets': trans[key].translationSets
                });
            }
        }, single);
        //$translate.refresh();
        return single;
    };
    
    /*------------------------------------------
       Update a translation value
    -------------------------------------------*/
    $scope.translator.send = function (trans) {
        
        /* Create the object to send */
        var json = {};
        json[trans.key] = {
            'values': trans.values,
            'translationSets': trans.translationSets
        };
        
        info(JSON.stringify(json, null, 4));
        /*
        $http({
            method  : 'PUT',
            url     : '/translations',
            data    : json,
            dataType: "json",
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // pass info as form data (not request payload)
        })
        .success(function (data) {
            $scope.infoMessage = data.message;
            $scope.translationsTable = $scope.translator.refresh();
            $translate.refresh();
        })
        .error(function (data, status) {
            $scope.errorMessage = 'FAILED! ' + status;
            $translate.refresh();
        });*/
    };

    
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
        $scope.translationsTable = $scope.translator.refresh();
    });
    
    $scope.$watch('language.current', function (newValue, oldValue) {
        
        // Ignore initial setup.
        if (newValue == oldValue) return;
        
        $translate.use($scope.language.current);
        $cookies.locale = $scope.language.current;
        
        // Reload data from service
        //$translate.refresh();
        
        // Update translation editor
        $scope.translationsTable = $scope.translator.refresh();
    });

});