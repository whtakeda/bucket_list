(function(){
  'use strict';

  angular
    .module('app')
    .factory('userDataService',userDataService);

  userDataService.$inject = ['$log','$http'];

  function userDataService($log,$http) {
    var userObj = {
      user: {},
      currentUser: currentUser
    };

    return userObj;

    function currentUser()
    {
      return $http.get('/me');
    }
  }
})();
