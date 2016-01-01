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
      update: update,
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
      return $http.post('users',{name:userObj.signupName, email:userObj.signupEmail, password:userObj.signupPassword});
    }

    function update(id)
    {
      return $http.put('users/' + id, {user:userObj.data});
    }

    function clearUser()
    {
      signupEmail = signupPassword = "";
      currentUser = currentUserData = {};
    }
  }
})();
