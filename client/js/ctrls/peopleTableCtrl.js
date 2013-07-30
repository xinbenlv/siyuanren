angular.module('angular-client-side-auth')
  .controller('PeopleTableCtrl',
    ['$rootScope', '$scope', '$filter','$location', function ($rootScope, $scope, $filter, $location) {
      console.log('SiyuanUserProfile: ' + JSON.stringify($rootScope.user.siyuanUserProfile));
      var fields = [
        { id:0, text: '姓名',},
        { id:1, text: '思源学员期数' },
        { id:2, text: '本科院系' },
        { id:3, text: '本科班级' },
        { id:4, text: "担任辅导员"},
        { id:5, text: "性别"},
        { id:6, text: "研究生阶段学校院系"},
        { id:7, text: "常驻国家"},
        { id:8, text: "省份"},
        { id:9, text: "常驻城市"},
        { id:10, text: "邮政编码"},
        { id:11, text: "目前职位"},
        { id:12, text: "MSN"},
        { id:13, text: "出生日期"},
        { id:14, text: "Tshirt尺码"},
        { id:15, text: "目前职位"},
        { id:16, text: "新浪微博"},
        { id:17, text: "通讯地址"},
        { id:18, text: "微信"},
        { id:19, text: "QQ"},
        { id:20, text: "LinkedIn"},
        { id:21, text: "Facebook"},
        { id:22, text: "Dropbox"},
        { id:23, text: "Skype"},
        { id:24, text: "Gtalk"},
        { id:25, text: "备注"},
        { id:26, text: '电话号码'},
        { id:27, text: 'Email地址'}
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

        $('#fieldsSelector').select2('data', [fields[0],fields[1],fields[2],fields[3], fields[26],fields[27]]);

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

        var c = {'思源学员期数': decodeURIComponent($rootScope.user.siyuanUserProfile[encodeURIComponent('思源学员期数')])};
        peopletable.load(c,
          $scope.selectedFields(),
          removeLoadingIndicator);
      };
      $scope.displaySameDept = function() {
        addLoadingIndicator();
        var c = {'本科院系': decodeURIComponent($rootScope.user.siyuanUserProfile[encodeURIComponent('本科院系')])};
        peopletable.load(c,
          $scope.selectedFields(),
          removeLoadingIndicator);
      };
      $scope.search = function() {
        var hash = $location.hash();
        if (hash === 'bx') {
          $scope.displaySameDept();
        } else if (hash === 'bq') {
          $scope.displaySameYearOfClass();
        } else if (hash === 'qt') {
          $scope.displayAll();
        }
      }

      $('#loadingIndicatorPanel').hide();
      $('#tablePanel').hide();
      initFieldsSelector();

      var query = $location.search();

      if(Object.keys(query).length > 0) {
        // Here is a query
        console.log(query);
        $scope.displayQuery(query);
      } else{
        $scope.search();
      }


    }]);

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