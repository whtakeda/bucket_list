(function(){
  'use strict';

  angular
    .module('app')
    .factory('userDataService',userDataService);

  userDataService.$inject = ['$log','$http'];

  function userDataService($log,$http) {
    var userObj = {
      data: {},
      signupName: "",
      signupEmail: "",
      signupPassword: "",
      currentUser: currentUser,
      currentUserData: currentUserData,
      signup: signup,
      whoami: whoami
    };

    return userObj;

    function whoami()
    {
      return angular.toJson(userObj.user);
    }

    function currentUser()
    {
      return $http.get('/me');
    }

    function currentUserData(id)
    {
      return $http.get('users/' + id);
    }

    function signup()
    {
      return $http.post('users',{name:userObj.signupName, email:userObj.signupEmail, password:userObj.signupPassword})
    }

    function clearUser()
    {
      signupEmail = signupPassword = "";
      currentUser = currentUserData = {};
    }
  }
})();
