angular.module('angular-client-side-auth')
  .controller('LoginCtrl',
    ['$rootScope', '$scope', '$location', '$window', 'Auth', function ($rootScope, $scope, $location, $window, Auth) {

      $scope.rememberme = true;
      $scope.login = function () {
        Auth.login({
            username: $scope.username,
            password: $scope.password,
            rememberme: $scope.rememberme
          },
          function (res) {
            $location.path('/');
          },
          function (err) {
            $rootScope.error = "Failed to login";
          });
      };

      $scope.loginOauth = function (provider) {
        $window.location.href = '/auth/' + provider;
      };
    }]);