/*----------------------------------------------------------------
  Let's write a new loader, because the original is not suitable
-----------------------------------------------------------------*/
app.factory('LoaderFactory', function ($http, $q, $timeout, $rootScope) {
    return function (options) {
        $rootScope.translator.selectedSet = options.selectedSet || 'Home';
        
        if (!options || !options.url) throw new Error('Couldn\'t use urlLoader since no url is given!');
        
        var deferred = $q.defer();
        
        // Get translations from mongoDb
        $http.get('/api/translationsetnames')
        .success(function (data) {
            $rootScope.translator.sets = data || ["Home"];
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

            setTimeout(function () {
                console.debug('Loading');
                $rootScope.translator.data = data;

                //$rootScope.$digest(); // propagate changes
                $rootScope.$apply();
            }, 400); // Simulate network latency */
        });
        
        return deferred.promise;
    };
});


/*----------------------------------------------------------------
  Translation Manager
-----------------------------------------------------------------*/
app.factory('TranslationFactory', function TranslationFactory($http) {
    
    return {
    
        addSet: function (trans) {
            var index = trans.translationSets.indexOf('');
            if (index == -1) {
                trans.translationSets.push('');
            }
        },

        removeSet: function (trans) {
            trans.translationSets = trans.translationSets.filter(function (x) {
                return x != '' && typeof x == 'string';
            });
        },

        enable: function (trans) {
            trans.enabled = !trans.enabled;
        },

        refresh: function (translator) {

            debug("Refreshing table...");// + JSON.stringify(translator.data, null));
            
            var single = [];

            angular.forEach(translator.data, function (trans, cat) {
            
                if (translator.selectedSet != cat) return;
            
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
            // Create the object to send
            var json = {};
            json[trans.key] = {
                'values': trans.values,
                'translationSets': trans.translationSets
            };
            
            info(JSON.stringify(json, null, 4));
            
            // Send
            $http({
                method  : 'POST',
                url     : '/api/translation',
                data    : json,
                dataType: "json",
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // pass info as form data (not request payload)
            })
            .success(function (data) {
                info("Success!");
                /*$scope.infoMessage = data.message;
                $scope.translator.table = $scope.translator.refresh();
                $translate.refresh();*/
            })
            .error(function (error, status) {
                console.error("%c [" + error.code + '] ' + error.message, 'background: #fee; color: #c30');
                //error('[' + error.code + '] ' + error.message);
                /*$scope.errorMessage = 'FAILED! ' + status;
                $translate.refresh();*/
            });
        },

        add: function (trans) {
            
            /*if (trans.key == '') {
                throw new Exception('Key cannot be null');
            }*/

            /*if (Object.keys(trans.values).length == 0) {
                for (f in trans.lang) {
                    trans.values[trans.lang[f]] = 'Empty';
                }
            }*/

            // Create the object to send
            var json = {};
            json[trans.key] = {
                'values': trans.values,
                'translationSets': trans.translationSets
            };

            info(JSON.stringify(json, null, 4));

            var validation = [
                function() { return !trans.hasOwnProperty('key') || trans.key == ''; },
                function() { return !trans.hasOwnProperty('values') || trans.values == ''; }
            ];
            
            for (var v in validation) {
                if (!validation[v]()) return error('Validation error. One or more values are empty.');
            }


            // Send
            $http({
                method  : 'POST',
                url     : '/api/translation',
                data    : json,
                dataType: "json",
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // pass info as form data (not request payload)
            })
            .success(function (data) {
                info("Success!");
                /*$scope.infoMessage = data.message;
                $scope.translator.table = $scope.translator.refresh();
                $translate.refresh();*/
            })
            .error(function (error, status) {
                console.error("%c [" + error.code + '] ' + error.message, 'background: #fee; color: #c30');
                //error('[' + error.code + '] ' + error.message);
                /*$scope.errorMessage = 'FAILED! ' + status;
                $translate.refresh();*/
            });
        }

    };

});
