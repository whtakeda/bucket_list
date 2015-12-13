(function(){
  'use strict';

  angular
    .module('app')
    .factory('userDataService',userDataService);

  userDataService.$inject = ['$log','$http'];

  function userDataService($log,$http) {
    var user = {
      name: "",
      googleId: ""
    }

    return user;

    var baseUrl = "http://localhost:3000/"


  }
})();
