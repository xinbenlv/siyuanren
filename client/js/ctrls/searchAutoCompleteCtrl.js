'use strict';

angular.module('angular-client-side-auth')
  .controller('SearchAutoCompleteCtrl',['$rootScope', '$scope','$http','$location', 'Auth',
    function($rootScope, $scope, $http, $location, Auth) {
      $scope.role = $rootScope.user.role;

      $scope.searchBtn = function() {
        if( $scope.role == Auth.userRoles.user || $scope.role == Auth.userRoles.admin){
          $location.path('/peopletable').search({'姓名': $('#q').val()}); // TODO(zzn) remember to sanitize user input
        }
        else {
          $location.path('/search').search({'姓名': $('#q').val()}); // TODO(zzn) remember to sanitize user input
        }
      };

    $scope.keypress = function($event) {
      if ($event.keyCode == 13 /*enter*/) {
        $scope.searchBtn();
      }
    };

  }]);