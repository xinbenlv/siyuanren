'use strict';

angular.module('angular-client-side-auth')
  .factory('Auth', function ($http, $rootScope, $cookieStore) {

    var accessLevels = routingConfig.accessLevels
      , userRoles = routingConfig.userRoles;

    $rootScope.user = $cookieStore.get('user') || { username: '', role: userRoles.anon };
    $cookieStore.remove('user');

    $rootScope.accessLevels = accessLevels;
    $rootScope.userRoles = userRoles;

    return {
      authorize: function (accessLevel, role) {
        if (role === undefined)
          role = $rootScope.user.role;
        return accessLevel & role;
      },
      isLoggedIn: function (user) {
        if (user === undefined)
          user = $rootScope.user;
        return user.role === userRoles.user || user.role === userRoles.admin;
      },
      register: function (data, success, error) {
        console.log('Registering:' + JSON.stringify(data));
        $http.post('/register', data).success(success).error(error);
      },
      login: function (user, success, error) {
        console.log('try to login!');//TODO(zzn): remove debug
        $http.post('/login', user).success(function (user) {
          $rootScope.user = user;
          success(user);
        }).error(error);
      },
      logout: function (success, error) {
        $http.post('/logout').success(function () {
          $rootScope.user.username = '';
          $rootScope.user.role = userRoles.public;
          success();
        }).error(error);
      },
      passwordReset: function(username, success, error ) {
        $http.post('/passwordReset', username).success(function () {
          success();
        }).error(error);
      },
      accessLevels: accessLevels,
      userRoles: userRoles
    };
  });

angular.module('angular-client-side-auth')
  .factory('Users', function ($http) {
    return {
      getAll: function (success, error) {
        $http.get('/users').success(success).error(error);
      }
    };
  });
