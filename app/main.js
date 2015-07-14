(function(angular){
  'use strict';

  angular
    .module('app',['ngRoute', 'lcSDK', 'versions', 'templates', 'instances'])
    .config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'main.tpl.html',
          controller: 'MainCtrl'
        })
        .when('/templates/add', {
          templateUrl: 'image.add.tpl.html',
          controller: 'TemplatesCtrl'
        })
        .when('/instances/add/:name', {
          templateUrl: 'instance.add.tpl.html',
          controller: 'InstancesCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider.html5Mode(true);
    })
    .controller('MainCtrl', function($scope, TemplatesService){
      $scope.templates = [];

      TemplatesService.find().then(function(result){
        $scope.templates = result;
      });
    });

}(angular));