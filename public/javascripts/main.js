function error(str) {
    console.error("%c " + str + ' ', 'background: #fee; color: #c30');
}
function debug(str) {
    console.debug("%c " + str + ' ', 'background: #bada55; color: #000');
}
function info(str) {
    console.info("%c " + str + ' ', 'background: #CFE8FF; color: #000');
}



var app = angular.module('translateApp', ['ngRoute', 'ngCookies', 'pascalprecht.translate']);

/*------------------------------------------------------------------------------
 Ryan's little helper (aka Overwrite translation filter, cos screw the rules!)
-------------------------------------------------------------------------------*/
app.filter('t', ['$parse', '$translate', '$sce', function ($parse, $translate) {
    return function (translationId, interpolateParams, interpolation) {
        if (!window.angular.isObject(interpolateParams)) interpolateParams = $parse(interpolateParams)(this);
        return $translate.instant(translationId + '.values.' + $translate.use(), interpolateParams, interpolation);
    };
}]);

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

/*------------------------------------------------------------------------------
 Add inline editor
-------------------------------------------------------------------------------*/
InlineEditor.elementChanged = function(el, oldVal, newVal) {
    console.log(oldVal);
    console.log(newVal);
};


/*------------------------------------------------------------------------------
 Initialize everything
-------------------------------------------------------------------------------*/
app.run(function($rootScope, $cookies, $translate, $q, $http) {
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
    return function (options) {
        $rootScope.translator.selectedSet = options.selectedSet || 'Generic';

        if (!options || !options.url) throw new Error('Couldn\'t use urlLoader since no url is given!');
        
        var deferred = $q.defer();

        // Get all translation sets
        $http.get('getTranslationSets')
        .success(function (data) {
            $rootScope.translator.sets = data;
            info(data);
        })
        .error(function(xhr, status) {
            error(status);
        }).then(function() {
            // Go fetch data from Bertrands service
            $http.get('lang/' + $rootScope.translator.sets).success(deferred.resolve);
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
    //$translateProvider.usePostCompiling(true); // puts translated elements in a <span>
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
        debug("Refreshing table " + JSON.stringify($scope.translator.data, null));
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