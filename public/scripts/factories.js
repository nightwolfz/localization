/*----------------------------------------------------------------
  Let's write a new loader, because the original is not suitable
-----------------------------------------------------------------*/
app.factory('LoaderFactory', function ($http, $q, $timeout, $rootScope) {
    return function (options) {
        $rootScope.translator.selectedSet = options.selectedSet || 'Generic';
        
        if (!options || !options.url) throw new Error('Couldn\'t use urlLoader since no url is given!');
        
        var deferred = $q.defer();
        
        // Get translations from mongoDb
        $http.get('/api/translationsetnames')
        .success(function (data) {
            $rootScope.translator.sets = data || ["Generic"];
        })
        .error(function (xhr, status) {
            error(status);
        }).then(function () {
            $http.get('api/translationset/' + $rootScope.translator.sets + ',Generic').success(deferred.resolve);
        });
        
        // Use returned json for translations
        deferred.promise.then(function (data) {

            //@TODO: Remove commented code when deploying
            //$rootScope.$digest(); // manually propagate changes

            setTimeout(function() {
                $rootScope.translator.data = data;
            }, 400); // Simulate network latency 
        });
        
        return deferred.promise;
    };
});


/*----------------------------------------------------------------
  Translation Manager
-----------------------------------------------------------------*/
app.factory('TranslationFactory', function TranslationFactory($http) {
    
    return {
        add: function (trans) {
            var index = trans.translationSets.indexOf('');
            if (index == -1) {
                trans.translationSets.push('');
            }
        },

        remove: function (trans) {
            trans.translationSets = trans.translationSets.filter(function (x) {
                return x != '' && typeof x == 'string';
            });
        },

        enable: function (trans) {
            trans.enabled = !trans.enabled;
        },

        refresh: function (data, selectedSet) {
            var single = [];
            debug("Refreshing table " + JSON.stringify(data, null));
            angular.forEach(data, function (trans, cat) {
            
                if (selectedSet != cat) return;
            
                for (key in trans) {
                    single.push({
                        'key': key,
                        'values': trans[key].values,
                        'translationSets': trans[key].translationSets
                    });
                }
            }, single);
            return single;
        },

        send: function(trans){
            /* Create the object to send */
            var json = {};
            json[trans.key] = {
                'values': trans.values,
                'translationSets': trans.translationSets
            };
            
            info(JSON.stringify(json, null, 4));
            
            $http({
                method  : 'POST',
                url     : '/api/translation',
                data    : json,
                dataType: "json",
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // pass info as form data (not request payload)
            })
            .success(function (data) {
                $scope.infoMessage = data.message;
                $scope.translator.table = $scope.translator.refresh();
                $translate.refresh();
            })
            .error(function (data, status) {
                $scope.errorMessage = 'FAILED! ' + status;
                $translate.refresh();
            });
        }
    };

});
