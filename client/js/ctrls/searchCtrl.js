'use strict';

angular.module('angular-client-side-auth')
  .controller('SearchCtrl',['$scope','$http','$location', function($scope, $http, $location) {
    var query = $location.search();
    console.log(query);
    if(query && query['姓名']){
      console.log('Valid query!');
      $http.get('/api/publicquery?collection="SiyuanUserProfile"&criteria=' + JSON.stringify(query) + '&fields="姓名 思源学员期数"')
        .success(function(data ) {
          console.log(data);
          $scope.results = data;
        }).error(function(err) {
          console.log('Error requesting query, err=' + JSON.stringify(err));
          $scope.results = undefined;
        });
    } else {
      console.log('Invalid query');
    }

  }]);

