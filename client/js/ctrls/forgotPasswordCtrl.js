angular.module('angular-client-side-auth')
  .controller('ForgotPasswordCtrl',
    ['$rootScope', '$scope', '$location', '$window', 'Auth', function ($rootScope, $scope, $location, $window, Auth) {
      $scope.submit = function () {
        Auth.passwordReset({
            username: $scope.username
          },
          function (res) {
            $scope.success = true;
          },
          function (err) {
            $rootScope.error = "重设密码失败";
          });
      };
    }]);