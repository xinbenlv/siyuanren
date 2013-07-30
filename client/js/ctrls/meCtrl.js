'use strict';

angular.module('angular-client-side-auth')
  .controller('MeCtrl',['$rootScope', '$scope','$http','$resource', function($rootScope, $scope, $http, $resource) {
    var fields = [
      {fieldId: 1, fieldName: '姓名'},
      {fieldId: 2, fieldName: '本科院系'},
      {fieldId: 3, fieldName: '思源学员期数'},
      {fieldId: 4, fieldName: '电话号码', fieldType: 'phone'},
      {fieldId: 5, fieldName: 'Email地址', fieldType: 'email'},
      {fieldId: 6, fieldName: '性别'},
      {fieldId: 7, fieldName: '出生日期'},
      {fieldId: 8, fieldName: '研究生阶段学校院系'},
      {fieldId: 9, fieldName: '常驻国家'},
      {fieldId: 10, fieldName: '省份'},
      {fieldId: 11, fieldName: '常驻城市'},
      {fieldId: 12, fieldName: '邮政编码'},
      {fieldId: 13, fieldName: '目前单位'},
      {fieldId: 14, fieldName: '目前职位'},
    ];

    var SiyuanUserProfile = $resource('/api/siyuanuserprofile/:siyuanid', {siyuanid:'@id'});

    $scope.setValue = function(user){
      $scope.fields = [];
      for (var i in fields){

        $scope.fields.push({
          fieldName: fields[i].fieldName,
          fieldValue: user[fields[i].fieldName],
          fieldType: fields[i].fieldType ? fields[i].fieldType: 'string'
        });
      }
      console.log($scope.fields);
    }

    SiyuanUserProfile.get({siyuanid:$rootScope.user.siyuanUserProfile.id}, function(user) {
      console.log(user);
      $scope.setValue(user);


    });

  }]);

