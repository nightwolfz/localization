app.factory('AuthService', function ($http, $cookies, User) {

    var authService = {};

    User.name = $cookies.username || false;
    User.token = $cookies.token || false;
    

    authService.refreshUser = function () {
        User.name = $cookies.username || false;
        User.token = $cookies.token || false;
    };
    
    authService.token = function (credentials) {
        return $http.post('/api/token', credentials).success(function (data) {
            $cookies.token = data.token;
        }).
        error(function () {
            console.warn('Could not get token');
        });
    };

    authService.login = function (credentials) {
        return authService.token(credentials).then(function () {
            return $http.post('/api/login', { 'token': $cookies.token })
            .success(function (user) {
                $cookies.username = user.username;
                authService.refreshUser();
            })
            .error(function() {
                console.warn('Could not get user');
            });
        });
    };
    
    authService.logout = function () {
        return $http.get('/api/logout').success(function (data) {
            $cookies.username = false;
            authService.refreshUser();
            console.warn('Logged out...');
        });
    };

    return authService;
});