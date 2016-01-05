(function(){
  'use strict';

  angular
    .module('app')
    .factory('loginDataService',loginDataService);

  loginDataService.$inject = ['$log','$http','authService','userDataService','activityDataService','$state'];

  function loginDataService($log,$http, authService, userDataService, activityDataService, $state) {

    var loginObj = {
      email: "",
      password: "",
      login: login
    };

    return loginObj;


    function login() {
      authService.login(loginObj.email, loginObj.password)
        .then(function(res) {
          loginObj.email = loginObj.password = "";
          // $log.log(res.data.user);
          userDataService.user = res.data.user;

///////////
      userDataService.currentUser().then(function(res){
        var currentUser = res.data;
        userDataService.currentUserData(currentUser._id)
          .then(function(res){
            userDataService.data = res.data;
            userDataService.data.lists.forEach(function(list){
              list.activity.forEach(function(activity){
                var a = activityDataService.activities.filter(function(act){
                  return act._id === activity.activityId;
                })[0];
                activity.title = a.title;
                activity.location = a.location;
                activity.cost = a.cost; // TODO: currently not using this????
                activity.description = a.description;
              })
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
