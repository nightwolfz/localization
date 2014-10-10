/*------------------------------------------------------------------------------
 Formatted logging
-------------------------------------------------------------------------------*/
function error(str) {
    console.error("%c " + str + ' ', 'background: #fee; color: #c30');
}
function debug(str) {
    console.debug("%c " + str + ' ', 'background: #bada55; color: #000');
}
function info(str) {
    console.info("%c " + str + ' ', 'background: #CFE8FF; color: #000');
}

var app = angular.module('translateApp', ['ngCookies', 'ngRoute', 'pascalprecht.translate', 'angular-flash.service', 'angular-flash.flash-alert-directive']);


/*------------------------------------------------------------------------------
 Add inline editor
-------------------------------------------------------------------------------*/
/*InlineEditor.elementChanged = function(el, oldVal, newVal) {
    console.log(oldVal);
    console.log(newVal);
};*/


/*------------------------------------------------------------------------------
 Initialize everything
-------------------------------------------------------------------------------*/
app.run(function($rootScope, $cookies, $translate, AUTH_EVENTS, AuthService) {
    $rootScope.translator = {};
    $cookies.locale = $cookies.locale || "fr";
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

    $rootScope.newkey = {
        key: '',
        translationSets: [],
        lang: ['fr','en','nl','de'],
        values: {}
    };
    
    // Check if authorized on every route change
    $rootScope.$on('$stateChangeStart', function (event, next) {
        var authorizedRoles = next.data.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            else $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
    });

});

app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor'
});

app.config(function ($translateProvider, $routeProvider, USER_ROLES) {
    
    // Load translation strings for the manager itself
    $translateProvider.useLoader('LoaderFactory', { url: 'lang' });

    // Restrict route access for guests and editors
    $routeProvider.when('/add-new-key', {
        templateUrl: 'partials/add-new-key.html',
        controller: 'langController',
        data: {
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
        }
    });

    $routeProvider.when('/list-translations', {
        templateUrl: 'partials/list-translations.html',
        controller: 'langController',
        data: {
            authorizedRoles: [USER_ROLES.all, USER_ROLES.editor]
        }
    });

    $routeProvider.otherwise({
        redirectTo: '/list-translations'
    });

});