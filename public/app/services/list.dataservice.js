(function(){
  'use strict';

  angular
    .module('app')
    .factory('listDataService',listDataService);

  listDataService.$inject = ['$log','$http'];

  function listDataService($log,$http) {
    var list = {
      activityId: "",
      order: 0,
      completed: false;
      reminderDate: "",
      accepted: false,
      visible: true,
      rating: 0,
      newUser: newUser
    }

    return list;

    var baseUrl = "http://localhost:3000/"

    function newList()
    {
      $http
        .post(baseUrl + "lists",list)
        .then(function(res){
          vm.user.lists.push(res.data);
        });
    }

    function clearList()
    {
      activityId= "";
      order = 0;
      completed = false;
      reminderDate = "";
      accepted = false;
      visible = true;
      rating = 0;
    }


    function home() {
      return $http
        .get(baseUrl);
    }

  }
})();
