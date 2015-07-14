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
        services: {
          'service-template': ['localhost:8080']
        },
        servicesRefreshInterval: 30000
      });

      $scope.images = [];
      $scope.containers = [];
      $scope.selectedImage = {};
      $scope.loadImageVersions = loadImageVersions;
      $scope.deployImage = deployImage;
      $scope.destroyContainer = destroyContainer;
      
      loadContainers();
      loadImages();
      loadImage($routeParams.name)

      function loadImages(){
        return http
          .get('service-template', '/stores/images')
          .then(function(result){
            $scope.images = result.data.results.map(function(itm){
              return itm.$payload;
            });
          });
      }

      function loadImage(imageName){
        return http
          .get('service-template', '/stores/images/' + imageName)
          .then(function(result){
            $scope.selectedImage = result.data.$payload;
            return result.data.$payload;
          })
          .then(loadImageVersions);        
      }

      function loadImageVersions(image){
        return http
          .get('service-template', '/api/DockerRegistryImageVersions?service=' + image.name)
          .then(function(result){
            $scope.versions = result.data.sort();
          });
      }
      
      function loadContainers(){
        return http
          .get('service-template', '/api/ShipyardContainers')
          .then(function(result){
            $scope.containers = result.data;
          });
      }

      function deployImage(image){
        var environment = image.envvars.split(' ').reduce(function(s,e){
          var keyValue = e.split('=');
          s[keyValue[0]] = keyValue[1];
          return s;
        },{});

        var config = {
          name: image.name,
          version: image.version,
          cpu: parseFloat(image.cpu),
          memory: parseInt(image.memory),
          port: parseInt(image.port),
          hostname: image.hostname || '',
          domain: image.domain || '',
          labels: [],
          environment: environment || {}
        };

        return http
          .post('service-template', '/api/ShipyardContainers', config)
          .then(function(result){
            console.log(result)
          });
      }
// ShipyardContainers
      function destroyContainer(image){
        console.log(image)
        return http
          .delete('service-template', '/api/ShipyardContainers/' + image.id)
          .then(loadContainers);
      }

    })
    .controller('MainCtrl', function($scope, $location, lcServiceClient){

      var http = lcServiceClient({ 
        discoveryServers: ['http://46.101.191.124:8500','http://46.101.138.192:8500'],
        services: {
          'service-template': ['localhost:8080']
        },        
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