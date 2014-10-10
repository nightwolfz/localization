app.controller('langController', function langController($scope, $http, $cookies, $location, $translate, AuthService, TranslationFactory) {

    /*------------------------------------------
       Load a partial view
    -------------------------------------------*/
    $scope.loadPartial = function (pathUrl) {
        $scope.partial = pathUrl;
        $location.path($scope.partial);
    };
    
    /*------------------------------------------
       CRUD Operations
    -------------------------------------------*/
    $scope.translator.add = TranslationFactory.add;
    $scope.translator.addSet = TranslationFactory.addSet;
    $scope.translator.removeSet = TranslationFactory.removeSet;
    $scope.translator.send = TranslationFactory.send;
    $scope.translator.enable = TranslationFactory.enable;
    $scope.translator.refresh = function () {
        $scope.translator.table = TranslationFactory.refresh($scope.translator);
    };
    
    /*------------------------------------------
      Refresh on page load
    -------------------------------------------*/
    $scope.$watch('translator.data', function (newValue, oldValue) {
        if (newValue != oldValue) $scope.translator.refresh();
        $scope.newkey.translationSets = [$scope.translator.selectedSet];
    });
    
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

app.controller('ApplicationController', function($scope, USER_ROLES, AuthService, User) {
    $scope.currentUser = User.name;
    $scope.userRoles = USER_ROLES;
});

app.controller('loginController', function loginController($scope, $rootScope, AUTH_EVENTS, AuthService, $location, flash, User) {

    flash.error = 'Do it live!';

    $scope.credentials = {
        username: '',
        password: ''
    };
    
    $scope.currentUser = User.name;

    $scope.login = function (credentials) {
        AuthService.login(credentials).then(function (data) { 
            User.name = AuthService.user;
            $location.path('list-translations');
        });
    };

    $scope.logout = function () {
        AuthService.logout().then(function () {
            $location.path('list-translations');
        });
    };

    $scope.showLoginForm = function() {
        return User.name != null;
    };
});