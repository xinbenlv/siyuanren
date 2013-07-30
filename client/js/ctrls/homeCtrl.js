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
