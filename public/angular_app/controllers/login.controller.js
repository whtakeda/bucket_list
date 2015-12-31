(function() {
  "use strict";

  angular
    .module("app")
    .controller("LoginController", LoginController);

  LoginController.$inject = ["$state", "userDataService", "$log", "authService","listDataService"];

  function LoginController($state, userDataService, $log, authService, listDataService) {
    var vm = this;

    vm.login      = login;
    vm.isLoggedIn = authService.isLoggedIn;
    vm.currentUser = userDataService.user;
    // Form data for login
    vm.loginData;
    vm.cancel = cancel;
    vm.ok = ok;

    function ok()
    {
       debugger;
    }

    function cancel()
    {
      $('#main').fadeOut(500,function(){$state.go('home')});
    }

    function login() {
      authService.login(vm.loginData.email, vm.loginData.password)
        .then(function(res) {
          $log.log(res.data.user);
          userDataService.user = res.data.user;

///////////
      userDataService.currentUser().then(function(res){
        vm.currentUser = res.data;
        userDataService.currentUserData(vm.currentUser._id)
          .then(function(res){
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
