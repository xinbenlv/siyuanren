var syrapp = angular.module('syrapp', ['$strap.directives'])
  .directive('syrnavbar', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope, $element) {
        $scope.navbarContent = {
          title: '思源人',
          left: [
            ['首页', '/'],
            ['新闻', '/news'],
            ['关于', '/about']
          ],
          right: [
            ['登录', '/login']
          ]
        };
      },
      template:
        '<div class="bs-docs-example">' +
        '  <div class="navbar" bs-navbar>' +
        '    <div class="navbar-inner">' +
        '      <a class="brand" href="#">{{navbarContent.title}}</a>' +
        '      <ul class="nav">' +
        '        <li ng-repeat="link in navbarContent.left">' +
        '          <a href="{{link[1]}}">{{link[0]}}</a>' +
        '        </li>' +
        '      </ul>' +
        '      <ul class="nav pull-right">' +
        '        <li ng-repeat="link in navbarContent.right">' +
        '          <a href="{{link[1]}}">{{link[0]}}</a>' +
        '        </li>' +
        '      </ul>' +
        '    </div>' +
        '  </div>' +
        '</div>',
      replace: true
    };
  })
  .controller('MainCtrl', function($scope, $window, $location) {
    $scope.$location = $location;
  })
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/syrapp/login',
      {redirectTo: '/login'});
      //{templateUrl: 'partials/login.html',
      //   controller: LoginCtrl});
  }]);


