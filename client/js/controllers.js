'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('AppCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    console.log(_.invert(Auth.userRoles)[$scope.user.role]);
    $scope.getUserRoleText = function(role) {
        return _.invert(Auth.userRoles)[role];
    };

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = true;
    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);

angular.module('angular-client-side-auth')
.controller('HomeCtrl',
['$rootScope','$scope', '$dialog', function($rootScope, $scope, $dialog) {
  $scope.myInterval = 3000;
  $scope.slides = [
    {image: 'http://fmn.rrimg.com/fmn056/xiaozhan/20121217/1535/xlarge_MWBM_4570000080291191.jpg', title: '年会', text: '思源年会.'},
    {image: 'http://fmn.rrimg.com/fmn065/xiaozhan/20121217/1535/xlarge_pNP8_33e4000099ef118e.jpg', title: '朱先生', text: '思源计划发起人朱先生.!'},
    {image: 'http://fmn.rrimg.com/fmn064/xiaozhan/20120910/2050/x_large_VnZ0_2cea00002aa71262.jpg', title: '北美思源小聚', text: '从景芳姐那儿不告而借的~~ 曲媛@6，韩赟儒@5，孔令昭@3，郝景芳@2，方铭@2~'}
  ];
  // Inlined template for demo
  var t = '<div class="modal-header">'+
    '<h1>This is the title</h1>'+
    '</div>'+
    '<div class="modal-body">'+
    '<p>Enter a value to pass to <code>close</code> as the result: <input ng-model="result" /></p>'+
    '</div>'+
    '<div class="modal-footer">'+
    '<button ng-click="close(result)" class="btn btn-primary" >Close</button>'+
    '</div>';


  $scope.opts = {
    backdrop: true,
    keyboard: true,
    backdropClick: true,
    dialogFade: true,
    templateUrl: 'partials/internalRegistration',
    //template: t,
    controller: 'DialogController'
  };

  $scope.d = $dialog.dialog($scope.opts);
  $scope.d.open().then(function(data){
    Auth.register(data,
      function(res) {
        $rootScope.user = res;
        $location.path('/');
      },
      function(err) {
        $rootScope.error = err;
      });
  });
}]);

angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = routingConfig.userRoles.user;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            },
            function(res) {
                $rootScope.user = res;
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('angular-client-side-auth')
.controller('PrivateCtrl',
['$rootScope', function($rootScope) {
}])
.controller('AdminCtrl',
['$rootScope', '$scope', 'Users', function($rootScope, $scope, Users) {
    $scope.loading = true;

    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

}]);

angular.module('angular-client-side-auth')
.controller('PeopleTableCtrl',
['$rootScope', '$scope', 'Users', function($rootScope, $scope, Users) {
  var URL = window.location.protocol + "//" + window.location.host;
  console.log("MSG: Connecting to " + URL);

  var socket = io.connect(URL);
  $rootScope.socket = socket;
  socket.emit('enter', {data: 'interesting'});

  socket.on('enter', function(data) {
    $scope.otherUsers = data.otherUsers;  //= data.otherUsers;
    peopletable.load(); // TODO(zzn): use async to load page
  });

  socket.on('someoneEnter', function(data) {
    $scope.otherUsers[data.enterUser] = data.enterUser;
  });

  socket.on('leave', function(data) {
    console.log('Leave' + data.leaveUser);
    delete $scope.otherUsers[data.leaveUser];
  });
}]);

// the dialog is injected in the specified controller
var DialogController = function($scope, dialog) {
  $scope.close = function(siyuanid, email){
    dialog.close({siyuanid: siyuanid, email: email});
  };
};
