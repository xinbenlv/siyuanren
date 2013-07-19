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
    ['$rootScope', '$scope', '$http', 'Users', function ($rootScope, $scope, $http, Users) {
      $scope.loading = true;

      Users.getAll(function (res) {

        $scope.users = res;
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
    }])
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

    }])
  .controller('MeCtrl',['$scope', function($scope) {
    $scope.name = '某个姓名';
    $scope.yearofclass = '思源某期';

  }])
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
  }])
;

angular.module('angular-client-side-auth')
  .controller('PeopleTableCtrl',
    ['$rootScope', '$scope', '$filter','$location', function ($rootScope, $scope, $filter, $location) {
      var fields = [
        { id:0, text: '姓名',},
        { id:1, text: '思源学员期数' },
        { id:2, text: '本科院系' },
        { id:3, text: '本科班级' },
        { id:4, text: '常用邮箱' },
        { id:5, text: '手机' },
        { id:6, text: 'auth' },
        { id:7, text: "担任辅导员"},
        { id:8, text: "性别"},
        { id:9, text: "研究生阶段学校院系"},
        { id:10, text: "常驻国家"},
        { id:11, text: "省份"},
        { id:12, text: "常驻城市"},
        { id:13, text: "邮政编码"},
        { id:14, text: "目前职位"},
        { id:15, text: "MSN"},
        { id:16, text: "出生日期"},
        { id:17, text: "Tshirt尺码"},
        { id:18, text: "目前职位"},
        { id:19, text: "新浪微博"},
        { id:20, text: "通讯地址"},
        { id:21, text: "微信"},
        { id:22, text: "QQ"},
        { id:23, text: "LinkedIn"},
        { id:24, text: "Facebook"},
        { id:25, text: "Dropbox"},
        { id:26, text: "Skype"},
        { id:27, text: "Gtalk"},
        { id:28, text: "备注"},
        { id:29, text: '电话号码'},
        { id:30, text: 'Email地址'}
      ];
      $scope.selectedFields = function () {
        var selectedList = $('#fieldsSelector').select2('val');
        var selectedFields = [];
        for(var i in selectedList) {
          selectedFields.push(fields[selectedList[i]]);
        }
        return selectedFields;
      };

      var removeLoadingIndicator = function() {
        console.log('remove li');
        $('#loadingIndicatorPanel').hide();
        $('#tablePanel').show();
      };
      var addLoadingIndicator = function() {
        console.log('add li');
        $('#loadingIndicatorPanel').show();
        $('#tablePanel').hide();
      };

      var initFieldsSelector = function() {
        $('#fieldsSelector').select2({
          multiple: true,
          data: fields
        });

        $('#fieldsSelector').select2('data', [fields[0],fields[1],fields[2],fields[3], fields[29],fields[30]]);

      };

      $scope.displayQuery = function(query) {
        console.log('Selected fields: ' + JSON.stringify($scope.selectedFields()));
        addLoadingIndicator();
        peopletable.load({'姓名':'周载南'},
          $scope.selectedFields(),
          removeLoadingIndicator); // TODO(zzn): use async to load page
      };
      $scope.displayAll = function() {
        console.log('Selected fields: ' + JSON.stringify($scope.selectedFields()));
        addLoadingIndicator();
        peopletable.load({}, $scope.selectedFields(), removeLoadingIndicator); // TODO(zzn): use async to load page
      };
      $scope.displaySameYearOfClass = function() {
        addLoadingIndicator();
        peopletable.load({'思源学员期数': $rootScope.user.siyuanUserProfile['思源学员期数']},
          $scope.selectedFields(),
          removeLoadingIndicator);
      };
      $scope.displaySameDept = function() {
        addLoadingIndicator();
        peopletable.load({'本科院系': $rootScope.user.siyuanUserProfile['本科院系']},
          $scope.selectedFields(),
          removeLoadingIndicator);
      };
      $('#loadingIndicatorPanel').hide();
      $('#tablePanel').hide();
      initFieldsSelector();

      var query = $location.search();
      if(Object.keys(query).length > 0) {
        // Here is a query
        console.log(query);
        $scope.displayQuery(query);
      }

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