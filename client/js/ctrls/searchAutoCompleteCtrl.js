'use strict';

angular.module('angular-client-side-auth')
  .controller('SearchAutoCompleteCtrl',['$rootScope', '$scope','$http','$location', 'Auth',
    function($rootScope, $scope, $http, $location, Auth) {

    $scope.searchBtn = function() {
      if($rootScope.user.role == Auth.userRoles.user || $rootScope.user.role == Auth.userRoles.admin){
        $location.path('/peopletable').search({'姓名': $('#q').val()}); // TODO(zzn) remember to sanitize user input
      }
      else {
        $location.path('/search').search({'姓名': $('#q').val()}); // TODO(zzn) remember to sanitize user input
      }
    };
  }]);