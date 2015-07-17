(function(angular){
  'use strict';

  angular
    .module('instances',['lcSDK', 'versions', 'templates'])
    .service('InstancesService', function($q, lcServiceClient){
      var http = lcServiceClient({ 
        discoveryServers: ['http://46.101.191.124:8500','http://46.101.138.192:8500'],
        timeout: 5000
      });

      return {
        find: find,
        create: create,
        remove: remove
      };

      function find(){
        return http
          .get('octo-service', '/api/ShipyardContainers')
          .then(function(result){
            return result.data;
          });
      }

      function create(value){
        if(!value || !value.name || !value.version) return $q.reject(new Error('Instance config is invalid'));

        return http
          .post('octo-service', '/api/ShipyardContainers', value)
          .then(function(result){
            return result.data;
          });
      }

      function remove(value){
        if(!value) return $q.reject(new Error('Instance ID is missing'));
        
        return http
          .delete('octo-service', '/api/ShipyardContainers/' + value)
          .then(function(result){
            return result.data;
          });
      }
    })
    .controller('InstancesCtrl', function($scope, $location, $routeParams, TemplatesService, VersionsService, InstancesService){
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
        return TemplatesService
          .find()
          .then(function(result){
            $scope.images = result;
          })
          .catch(function(error){
            Materialize.toast(error.message, 4000);
          });
      }

      function loadImage(imageName){
        return TemplatesService
          .load(imageName)
          .then(function(result){
            $scope.selectedImage = result;
            return result;
          })
          .then(loadImageVersions)
          .catch(function(error){
            Materialize.toast(error.message, 4000);
          });        
      }

      function loadImageVersions(image){
        if(!image) return;
        
        VersionsService
          .load(image.name)
          .then(function(result){
            $scope.versions = result;
          })
          .catch(function(error){
            Materialize.toast(error.message, 4000);
          });          
      }
      
      function loadContainers(){
        InstancesService
          .find()
          .then(function(result){
            $scope.containers = result;
          })
          .catch(function(error){
            Materialize.toast(error.message, 4000);
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

        return InstancesService
          .create(config)
          .then(function(result){
            Materialize.toast('Created', 4000);            
          })
          .then(loadContainers)
          .catch(function(error){            
            Materialize.toast(error.data.message, 4000);
          });
      }

      function destroyContainer(image){
        return InstancesService
          .remove(image.id)
          .then(function(result){
            Materialize.toast('Removed', 4000);
          })          
          .then(loadContainers)
          .catch(function(error){
            Materialize.toast(error.data.message, 4000);
          });
      }
    });

}(angular));