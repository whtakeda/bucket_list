(function(){
  'use strict';

  angular
    .module('app')
    .factory('activityDataService',activityDataService);

  activityDataService.$inject = ['$log','$http'];

  function activityDataService($log,$http) {
    var baseUrl = "http://localhost:3000/"
    var activity = {
      title: "",
      description: "",
      rating: 0,
      location: "",
      cost: "",
      duration: "",
      tags: ""
    }

    return activity;

    function home() {
      return $http
        .get(baseUrl);
    }

  }
})();
