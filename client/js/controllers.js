'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
  .controller('AppCtrl',
    ['$rootScope', '$scope', '$location', 'Auth', function ($rootScope, $scope, $location, Auth) {
      console.log(_.invert(Auth.userRoles)[$scope.user.role]);
      $scope.getUserRoleText = function (role) {
        return _.invert(Auth.userRoles)[role];
      };

      $scope.logout = function () {
        Auth.logout(function () {
          $location.path('/login');
        }, function () {
          $rootScope.error = "Failed to logout";
        });
      };
    }]);

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

angular.module('angular-client-side-auth')
  .controller('HomeCtrl',
    ['$rootScope', '$scope', function ($rootScope, $scope) {
      $scope.myInterval = 3000;
      $scope.slides = [
        {image: '/img/1.jpg', title: '年会', text: '思源年会.'},
        {image: '/img/2.jpg', title: '朱先生', text: '思源计划发起人朱先生.!'},
        {image: '/img/3.jpg', title: '北美思源小聚', text: '从景芳姐那儿不告而借的~~ 曲媛@6，韩赟儒@5，孔令昭@3，郝景芳@2，方铭@2~'}
      ];
    }]);

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

angular.module('angular-client-side-auth')
  .controller('PrivateCtrl',
    ['$rootScope', function ($rootScope) {
    }])
  .controller('AdminCtrl',
    ['$rootScope', '$scope', 'Users', function ($rootScope, $scope, Users) {
      $scope.loading = true;

      Users.getAll(function (res) {
        $scope.users = res;
        $scope.loading = false;
      }, function (err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
      });

    }])
  .controller('CheckSiyuanRenCtrl',
    ['$rootScope', '$scope', function ($rootScope, $scopes) {


    }]);

angular.module('angular-client-side-auth')
  .controller('PeopleTableCtrl',
    ['$rootScope', '$scope', 'Users', function ($rootScope, $scope, Users) {
      peopletable.load(); // TODO(zzn): use async to load page

    }]);

// the dialog is injected in the specified controller
var DialogController = function ($scope, dialog) {
  $scope.close = function (username, siyuanid, email) {
    dialog.close({username: username, siyuanid: siyuanid, email: email});
  };
};

var getName = function ($scope, callback) {

  // Send request
  $.ajax({
    url: '/api/publicquery?collection=SiyuanUserProfile',
    type: 'GET',
    data: null,
    dataType: 'json',
    async: false,
    success: function (docs) {

      var nameList = [];
      for (var i in docs) {
        nameList.push({label: docs[i]['姓名'], value: docs[i]._id});
      }

      $scope.myOption = {
        options: {
          html: true,
          focusOpen: false,
          onlySelect: true,
          source: function (request, response) {

            var data = nameList;

            data = $scope.myOption.methods.filter(data, request.term);

            if (!data.length) {
              data.push({
                label: 'not found',
                value: ''
              });
            }
            response(data);
          }
        },
        methods: {}

      };
      callback();
    }
  });

}