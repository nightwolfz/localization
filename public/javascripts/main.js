/*var app = angular.module('translateApp', ['ngRoute', 'ngCookies', 'pascalprecht.translate']);

window.i18n_translations = {};

app.run(function ($http) {
    
    $http.get('locales/en.json', function (data) {
        window.i18n_translations['en'] = data;
    });
    $http.get('locales/fr.json', function (data) {
        window.i18n_translations['fr'] = data;
    });
});

app.config(function ($translateProvider) {
    $translateProvider.translations('en', <%=getLanguage('en')%>);
    $translateProvider.translations('fr', <%=getLanguage('fr')%>);
    //$translateProvider.translations('fr', $http.get('javascripts/' + $scope.language.current + '.json'));
    $translateProvider.preferredLanguage('en');
});

app.controller('langController', function ($scope, $http, $cookies, $location, $translate) {
    
    $scope.language = {
        options: [{ key: 'en', name: 'English' },
                  { key: 'fr', name: 'Français' }],

        current: '<%=currentLocale%>',
        
        getTranslations: function () {
                $http.get('javascripts/' + $scope.language.current + '.json', function (data) {
                    window.i18n_translations = data;
                });
        },

        change: function () {
            $translate.use($scope.language.current);
            //document.location.href = "/lang/" + $scope.language.current;
            //$http.get('lang/' + $scope.language.current).success(function (data) { $scope.phones = data; });
        }
    };

});*/