'use strict';

angular.module('angular-client-side-auth', ['ngCookies', 'ui.bootstrap', 'ui.autocomplete'])

  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider.when('/',
      {
        templateUrl: '/partials/home',
        controller: 'HomeCtrl',
        access: access.anon
      });
    $routeProvider.when('/login',
      {
        templateUrl: '/partials/login',
        controller: 'LoginCtrl',
        access: access.anon
      });
    $routeProvider.when('/forgotPassword',
      {
        templateUrl: '/partials/forgotPassword',
        controller: 'ForgotPasswordCtrl',
        access: access.anon
      });
    $routeProvider.when('/register',
      {
        templateUrl: '/partials/register',
        controller: 'RegisterCtrl',
        access: access.anon
      });
    $routeProvider.when('/auth/twitter',
      {
        templateUrl: '/partials/register',
        controller: 'RegisterCtrl',
        access: access.anon
      });
    $routeProvider.when('/private',
      {
        templateUrl: '/partials/private',
        controller: 'PrivateCtrl',
        access: access.user
      });
    $routeProvider.when('/admin',
      {
        templateUrl: '/partials/admin',
        controller: 'AdminCtrl',
        access: access.admin
      });
    $routeProvider.when('/checkSiyuanRen',
        {
            templateUrl: '/partials/checkSiyuanRen',
            controller: 'CheckSiyuanRenCtrl',
            access: access.anon
        });
    $routeProvider.when('/peopletable',
      {
        templateUrl: '/partials/peopletable',
        controller: 'PeopleTableCtrl',
        access: access.user
      });
    $routeProvider.when('/me',
      {
        templateUrl: '/partials/me',
        controller: 'MeCtrl',
        access: access.user
      });
    $routeProvider.when('/onBoard',
      {
        templateUrl: '/partials/onBoard',
        controller: 'OnBoardCtrl',
        access: access.anon
      });
    $routeProvider.when('/changeHistory',
      {
        templateUrl: '/partials/changeHistory',
        controller: 'ChangeHistoryCtrl',
        access: access.user
      });
    $routeProvider.when('/search',
      {
        templateUrl: '/partials/search',
        controller: 'SearchCtrl',
        access: access.anon
      });
    $routeProvider.when('/404',
      {
        templateUrl: '/partials/404',
        access: access.public
      });
    $routeProvider.when('/underConstruction',
      {
        templateUrl: '/partials/underConstruction',
        access: access.public
      });
    $routeProvider.otherwise({redirectTo: '/404'});

    $locationProvider.html5Mode(true);

    var interceptor = ['$location', '$q', function ($location, $q) {
      function success(response) {
        return response;
      }

      function error(response) {

        if (response.status === 401) {
          $location.path('/login');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

      return function (promise) {
        return promise.then(success, error);
      }
    }];

    $httpProvider.responseInterceptors.push(interceptor);

  }])

  .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      $rootScope.error = null;
      if (!Auth.authorize(next.access)) {
        if (Auth.isLoggedIn()) $location.path('/');
        else                  $location.path('/login');
      }
    });

    $rootScope.appInitialized = true;
  }]);