
angular.module('angular-client-side-auth')
  .controller('AdminCtrl',
    ['$rootScope', '$scope', '$http', 'Users', function ($rootScope, $scope, $http, Users) {
      $scope.loading = true;
      $scope.currentIndex = 0;

      $scope.toPrev = function(){
        $scope.currentIndex = Math.max(0, $scope.currentIndex-1) ;
        $scope.loadCurrentPage();
      }
      $scope.toNext = function(){
        $scope.currentIndex = Math.min($scope.pages.length-1, $scope.currentIndex+1) ;
        $scope.loadCurrentPage();
      }
      $scope.toLast = function(){
        $scope.currentIndex = $scope.pages.length-1 ;
        $scope.loadCurrentPage();
      }
      $scope.toFirst = function(){
        $scope.currentIndex = 0 ;
        $scope.loadCurrentPage();
      }
      $scope.toPage = function(pageIndex){
        $scope.currentIndex = Math.min(Math.max(0, pageIndex), $scope.pages.length -1);
        $scope.loadCurrentPage();
      }
      $scope.loadCurrentPage = function() {
        $scope.currentPage = $scope.pages.length ? $scope.pages[$scope.currentIndex] : [];
      }
      $scope.paginate = function(a/*array*/, pageSize){
        var numPage = Math.ceil(a.length / pageSize);
        var ret = [];
        var singlePage = [];
        for(var i = 0; i < a.length; i++) {
          singlePage.push(a[i]);
          if(singlePage.length % pageSize == 0){
            ret.push(singlePage);
            singlePage = [];
          }
        }
        if(singlePage.length > 0) ret.push(singlePage);
        return ret;
      }
      Users.getAll(function (res) {

        $scope.users = res;
        $scope.pages = $scope.paginate($scope.users, 30);
        $scope.loadCurrentPage();


        $scope.loading = false;
      }, function (err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
      });

      $scope.emailReset = function(id) {
        var url = '/api/emailreset';
        var user = {};
        user.id = id;
        $http.post(url, user)
          .success(function(data) {
            $scope.showSuccess = true;
          }).error(function(err) {
            console.log(err);
          });
      }
    }]);