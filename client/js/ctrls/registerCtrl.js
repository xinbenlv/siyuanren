angular.module('angular-client-side-auth')
  .controller('RegisterCtrl',
    ['$rootScope', '$scope', '$location', 'Auth', '$compile', function ($rootScope, $scope, $location, Auth, $compile) {
      getName($scope, function () {

      });
      $scope.register = function () {
        Auth.register({
            username: $scope.username,
            password: $scope.password,
            siyuanid: $scope.siyuanid,
            user: $rootScope.user,
            email: $scope.email,
            meta: $rootScope.user.meta
          },
          function (res) {
            $rootScope.user = res;
            $location.path('/');
          },
          function (err) {
            $rootScope.error = err;
          });
      };
    }]);
