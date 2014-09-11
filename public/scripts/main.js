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

var app = angular.module('translateApp', ['ngRoute', 'ngCookies', 'pascalprecht.translate']);


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
app.run(function($rootScope, $cookies, $translate) {
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

    $rootScope.newkey = {
        key: '',
        translationSets: [],
        lang: ['en','fr','nl','de'],
        values: {}
    };
});

app.config(function ($translateProvider) {
    $translateProvider.useLoader('LoaderFactory', { url: 'lang' });
    //$translateProvider.usePostCompiling(true); // also puts translated elements in a <span>
});