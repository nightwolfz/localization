/*----------------------------------------------------------------
 Let's write a new loader, because the original is not suitable
-----------------------------------------------------------------*/
app.factory('$transloader', function ($http, $q, $timeout, $rootScope) {
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
        .error(function (xhr, status) {
            error(status);
        }).then(function () {
            // Go fetch data from Bertrands service
            $http.get('lang/' + $rootScope.translator.sets).success(deferred.resolve);
        });
        
        // Use returned json for translations
        deferred.promise.then(function (data) {
            $rootScope.translator.data = data; //$rootScope.$digest(); // manually propagate changes
            //setTimeout(function(){}, 1000); //simulate network latency @TODO: Remove when deploying
        });
        
        return deferred.promise;
    };
});