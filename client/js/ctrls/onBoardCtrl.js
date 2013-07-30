'use strict';

angular.module('angular-client-side-auth')
  .controller('OnBoardCtrl',['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.showLoading = true;
    $scope.showForm = false;
    $scope.showFailure = false;
    $scope.showSuccess = false;

    var token = $location.search()['token'];
    $scope.loadOnBoardForm= function(){
      var url = '/api/onboard?token=' + token;
      $http.get(url)
        .success(function(username) {
          console.log('username: ' + username);
          $scope.username = username;
          $scope.showLoading = false;
          $scope.showForm = true;

        }).error(function(err) {
          $scope.showLoading = false;
          $scope.showForm = false;
          $scope.showFailure = true;
          $scope.showSucess = false;
          console.log(err);
        });
    };

    $scope.submit = function() {
      var user = {};
      user.token = $location.search()['token'];
      user.username = $scope.username;
      user.password = $scope.password;
      $scope.showLoading = true;
      $http.post('/api/onboard', user)
        .success(function (user) {
          $scope.showLoading = false;
          $scope.showForm = false;
          $scope.showSuccess = true;
          $scope.showFailure = false;

          window.setTimeout(function(){
            $location.path('/login');
          }, 2000);
        }).error(function(error){
          $scope.showLoading = false;
          $scope.showForm = false;
          $scope.showSuccess = false;
          $scope.showFailure = true;
        });
    };

    if(!token) {
      $location.path('/login');
    } else {
      $scope.loadOnBoardForm();
    }

  }]).controller('ChangeHistoryCtrl',['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.showLoading = true;
    $scope.showForm = false;
    $scope.showFailure = false;
    $scope.showSuccess = false;
    var url = '/api/changeHistory';
    $http.get(url)
      .success(function(histories) {
        $scope.histories = histories;
      }).error(function(err) {
      });
  }]);

