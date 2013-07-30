angular.module('angular-client-side-auth')
  .controller('CheckSiyuanRenCtrl',
    ['$http','$rootScope', '$scope', function ($http, $rootScope, $scope) {
      $scope.yearofclass_options = ['思源一期', '思源二期', '思源三期', '思源四期', '思源五期',
        '思源六期', '思源七期', '思源八期', '思源九期', '思源十期'];

      $('#exist').hide();
      $('#notexist').hide();

      $scope.submit = function () {

        $http.get('/api/publicquery?collection="SiyuanUserProfile"&criteria={"姓名":"' + $scope.fullname + '","思源学员期数":"' + $scope.yearofclass + '"}&fields="姓名 思源学员期数"')
          .success(function(data ) {
            if(data && data.length > 0) {
              $('#exist').show();
              $('#notexist').hide();
            }
            else {
              $('#exist').hide();
              $('#notexist').show();
            }
            console.log(data);
          }).error(function(data) {
            console.log(data);
          });
      };

    }]);