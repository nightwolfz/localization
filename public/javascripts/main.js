var app = angular.module('translateApp', ['ngRoute', 'ngCookies', 'pascalprecht.translate']);

/*------------------------------------------------------------------------------
 Ryan's little helper (aka Overwrite translation filter, cos screw the rules!)
-------------------------------------------------------------------------------*/
app.filter('t', ['$parse', '$translate', 
    function ($parse, $translate) {
        return function (translationId, interpolateParams, interpolation) {
            if (!window.angular.isObject(interpolateParams)) interpolateParams = $parse(interpolateParams)(this);
            return $translate.instant(translationId + '.values.' + $translate.use(), interpolateParams, interpolation);
        };
    }
]);

app.run(function($rootScope, $cookies, $translate) {
    /*----------------------------------------
                    Initialize
    -----------------------------------------*/
    $rootScope.translator = {};
    $cookies.locale = $cookies.locale || "en";
    $translate.use($cookies.locale);
    $rootScope.languageKeys = [];
    $rootScope.availableLanguages = [{ key: 'en', name: 'English' }, { key: 'fr', name: 'Français' }];
    $rootScope.availableLanguages.map(function (v) {
        $rootScope.languageKeys.push(v.key);
    });

    $rootScope.language = {
        keys: $rootScope.languageKeys,
        options: $rootScope.availableLanguages,
        current: $cookies.locale
    };

});

/*----------------------------------------------------------------
 Let's write a new loader, because the original is not suitable
-----------------------------------------------------------------*/
app.factory('$transLoader', function ($http, $q, $timeout, $rootScope) {
    return function(options) {
        $rootScope.translator.selectedSet = options.selectedSet || 'Generic';

        if (!options || !options.url) throw new Error('Couldn\'t use urlLoader since no url is given!');

        console.debug('LOADING DATA ' + $rootScope.translator.selectedSet);

        // Go fetch data from Bertrands service
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: options.url // options.url + '/' + $rootScope.translator.selectedSet
        })
        .success(deferred.resolve)
        .error(function() {
            deferred.reject(options.url);
        });
        
        // Use returned json for translations
        deferred.promise.then(function(data) {
            $rootScope.translator.data = data; //$rootScope.$digest(); // manually propagate changes
            //setTimeout(function(){}, 1000); //simulate network latency @TODO: Remove when deploying
        });
        
        return deferred.promise;
    };
});

app.config(function ($translateProvider) {
    $translateProvider.useLoader('$transLoader', { url: 'lang' }); //more than meets the eye!
});

app.controller('langController', function ($scope, $http, $cookies, $location, $translate, $transLoader) {
    /*------------------------------------------
        Add translation set
    -------------------------------------------*/
    $scope.translator.add = function(trans) {
        var index = trans.translationSets.indexOf('');
        if (index == -1) {
            trans.translationSets.push('');
        }
    };

    /*------------------------------------------
        Remove translation set
    -------------------------------------------*/
    $scope.translator.remove = function(trans) {
        trans.translationSets = trans.translationSets.filter(function(x) {
            return x != '' && typeof x == 'string';
        });
    };

    /*------------------------------------------
        Enable/disable a field
    -------------------------------------------*/
    $scope.translator.enable = function(trans) {
        trans.enabled = !trans.enabled;
    };

    /*------------------------------------------
        Flatten multidimensional array to single
    -------------------------------------------*/
    $scope.translator.refresh = function() {
        var single = [];
        console.warn($scope.translator.data);
        angular.forEach($scope.translator.data, function(trans, cat) {

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
    $scope.translator.send = function(trans) {

        /* Create the object to send */
        var json = {};
        json[trans.key] = {
            'values': trans.values,
            'translationSets': trans.translationSets
        };

        console.debug(JSON.stringify(json, null, 4));

        /*$http({
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

        $scope.translator.selectedSet = newValue;
        
        //$translate.useLoader('$transLoader', { url: 'lang', selectedSet: newValue});
        
        // Update translation editor
        $scope.translationsTable = $scope.translator.refresh();
    }, true);
    
    $scope.$watch('language.current', function (newValue, oldValue) {
        
        // Ignore initial setup.
        if (newValue == oldValue) return;
        
        $translate.use($scope.language.current);
        
        // Reload data from service
        $translate.refresh();
        
        // Update translation editor
        $scope.translationsTable = $scope.translator.refresh();
    }, true);

});