(function(angular){
  'use strict';

  angular
    .module('app',['ngRoute', 'lcSDK', 'versions', 'templates', 'instances'])
    .config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'logon.tpl.html',
          controller: 'AuthCtrl'
        })        
        .when('/main', {
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
    .controller('AuthCtrl', function($scope, $location, lcServiceClient){
      var http = lcServiceClient({ 
        discoveryServers: ['http://46.101.191.124:8500','http://46.101.138.192:8500']
      });

      $scope.logon = logon;

      function logon(account){
        if(!account || !account.username || !account.password){
          return Materialize.toast('Account is invalid', 4000);
        }
        
        return http
          .post('service-template', '/manage/login', null, account.username, account.password)
          .then(function(){
            $location.path('/main');
          })
          .catch(function(error){
            if(error.status === 0) return Materialize.toast('Network error', 4000);
            Materialize.toast(error.data.message, 4000);
          });
      }

    })
    .controller('MainCtrl', function($scope, TemplatesService){
      $scope.templates = [];
      $scope.removeTemplate = removeTemplate;

      loadTemplates();

      function loadTemplates(){
        TemplatesService.find().then(function(result){
          $scope.templates = result;
        })
        .catch(function(error){
          if(error.status === 0) return Materialize.toast('Network error', 4000);
          Materialize.toast(error.data.message, 4000);
        });
      }

      function removeTemplate(template){
        TemplatesService
          .remove(template)
          .then(loadTemplates)
          .catch(function(error){
            Materialize.toast(error.message, 4000);
          });
      }

    });

}(angular));