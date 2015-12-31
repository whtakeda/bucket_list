(function(){
  'use strict';

  angular
    .module('app')
    .factory('loginDataService',loginDataService);

  loginDataService.$inject = ['$log','$http','authService','userDataService','$state'];

  function loginDataService($log,$http, authService, userDataService, $state) {

    var loginObj = {
      login: login
    };

    return loginObj;


    function login(email,password) {
      authService.login(email, password)
        .then(function(res) {
          $log.log(res.data.user);
          userDataService.user = res.data.user;

///////////
      userDataService.currentUser().then(function(res){
        var currentUser = res.data;
        userDataService.currentUserData(currentUser._id)
          .then(function(res){
            debugger;
            userDataService.data = res.data;
            userDataService.data.lists.forEach(function(list){
            })
          },
          function(err){
            $log.log(err);
          });
      },
      function(err){
        $log.log(err);
      });
///////////
          $state.go('home');
        });
    };
  }
})();
