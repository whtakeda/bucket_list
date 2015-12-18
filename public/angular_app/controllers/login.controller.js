(function() {
  "use strict";

  angular
    .module("app")
    .controller("LoginController", LoginController);

  LoginController.$inject = ["$state", "userDataService", "$log", "authService"];

  function LoginController($state, userDataService, $log, authService) {
    var vm = this;

    vm.login      = login;
    vm.isLoggedIn = authService.isLoggedIn;
    vm.currentUser = userDataService.user;

    // Form data for login
    vm.loginData;
    vm.cancel = cancel

    function cancel()
    {
      $('#main').fadeOut(500,function(){$state.go('home')});
    }

    function login() {
      authService.login(vm.loginData.email, vm.loginData.password)
        .then(function(res) {
          $log.log(res.data);
//          debugger;
          userDataService.user = res.data.user;
          $state.go('home');
        });
    };

  }

})();
