(function(angular){
  'use strict';

  angular
    .module('versions',['lcSDK'])
    .service('VersionsService', function($q, lcServiceClient){
      var http = lcServiceClient({ 
        discoveryServers: ['http://46.101.191.124:8500','http://46.101.138.192:8500']
      });

      return {
        load: load
      };

      function load(name){
        if(!name) return $q.reject(new Error('Service name is missing'));
        return http
          .get('octo-service', '/api/DockerRegistryImageVersions?service=' + name)
          .then(function(result){
            return result.data.sort();
          });
      }
    });

}(angular));        