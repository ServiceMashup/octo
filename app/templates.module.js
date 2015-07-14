(function(angular){
  'use strict';

  angular
    .module('templates',['lcSDK', 'versions'])
    .service('TemplatesService', function($q, lcServiceClient){
      var http = lcServiceClient({ 
        discoveryServers: ['http://46.101.191.124:8500','http://46.101.138.192:8500'],
        services: {
          'service-template': ['localhost:8080']
        },        
      });

      return {
        load: load,
        find: find,
        create: create
      };

      function load(name){
        return http
          .get('service-template', '/stores/images/' + name)
          .then(function(result){
            return result.data.$payload;
          });
      }

      function find(){
        return http
          .get('service-template', '/stores/images')
          .then(function(result){
            return result.data.results.map(function(itm){
              return itm.$payload;
            });
          });
      }

      function create(template){
        if(!template || !template.name) return $q.reject(new Error('Template name is missing'));

        return http.post('service-template', '/stores/images/' + template.name, template);
      }
    })
    .controller('TemplatesCtrl', function($scope, $location, TemplatesService, VersionsService){
      $scope.versions = [];
      $scope.createTemplate = createTemplate;
      $scope.loadImageVersions = loadImageVersions;

      function createTemplate(template){
        TemplatesService
          .create(template)
          .then(function(result){
            $location.path('/');
          })
          .then(function(result){
            Materialize.toast('Created', 4000);
          })          
          .catch(function(error){
            Materialize.toast(error.message, 4000);
          });
      }

      function loadImageVersions(name){
        VersionsService
          .load(name)
          .then(function(result){
            $scope.versions = result;
          })
          .catch(function(error){
            Materialize.toast(error.message, 4000);
          });
      }
    });

}(angular));    