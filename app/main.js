(function(angular){
  'use strict';

  angular
    .module('app',['ngRoute', 'lcSDK'])
    .config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'main.tpl.html',
          controller: 'MainCtrl'
        })
        .when('/images/add', {
          templateUrl: 'image.add.tpl.html',
          controller: 'MainCtrl'
        })
        .when('/instances/add/:name', {
          templateUrl: 'instance.add.tpl.html',
          controller: 'InstancesCtrl'
        })        
        .when('/deploy', {
          templateUrl: 'deploy.tpl.html'
        })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider.html5Mode(true);

    })
    .controller('InstancesCtrl', function($scope, $location, $routeParams, lcServiceClient){
      var http = lcServiceClient({ 
        discoveryServers: ['http://46.101.191.124:8500','http://46.101.138.192:8500'],
        servicesRefreshInterval: 30000
      });

      $scope.images = [];
      $scope.containers = [];
      $scope.selectedImage = {};
      $scope.loadImageVersions = loadImageVersions;

      http
        .get('service-template', '/stores/images')
        .then(function(result){
          $scope.images = result.data.results.map(function(itm){
            return itm.$payload;
          });
        });

      http
        .get('service-template', '/stores/images/' + $routeParams.name)
        .then(function(result){
          $scope.selectedImage = result.data.$payload;
          return result.data.$payload;
        })
        .then(loadImageVersions);

      function loadImageVersions(image){
        http
          .get('service-template', '/api/DockerRegistryImageVersions?service=' + image.name)
          .then(function(result){
            $scope.versions = result.data.sort();
          });
      }
      
      loadContainers();

      function loadContainers(){
        http
          .get('service-template', '/api/ShipyardContainers')
          .then(function(result){
            $scope.containers = result.data;
            console.log($scope.containers)
          });
      }

    })
    .controller('MainCtrl', function($scope, $location, lcServiceClient){

      var http = lcServiceClient({ 
        discoveryServers: ['http://46.101.191.124:8500','http://46.101.138.192:8500'],
        servicesRefreshInterval: 30000
      });

      $scope.versions = [];

      $scope.addImage = function(template){
        if(!template || !template.name) return Materialize.toast('Enter a template name.', 4000);

        http
          .post('service-template', '/stores/images/' + template.name, template)
          .then(function(result){
            $location.path('/');
          });
      };

      $scope.loadImageVersions = function(name){
        http
          .get('service-template', '/api/DockerRegistryImageVersions?service=' + name)
          .then(function(result){
            $scope.versions = result.data.sort();

          });
      }

      http
        .get('service-template', '/stores/images')
        .then(function(result){
          $scope.images = result.data.results;          
        });

      // http
      //   .get('consul-8500', '/v1/catalog/services')
      //   .then(function(result){
      //     console.log(result.data);
      //   });

    });

}(angular));