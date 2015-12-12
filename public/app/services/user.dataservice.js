(function(){
  'use strict';

  angular
    .module('app')
    .factory('userDataService',userDataService);

  userDataService.$inject = ['$log','$http'];

  function userDataService($log,$http) {
    var baseUrl = "http://localhost:3000/"

    function home() {
      return $http
        .get(baseUrl);
    }

    return {
      home:home
    };
  }
})();
