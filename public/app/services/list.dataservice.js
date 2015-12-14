(function(){
  'use strict';

  angular
    .module('app')
    .factory('listDataService',listDataService);

  listDataService.$inject = ['$log','$http'];

  function listDataService($log,$http) {
    var baseUrl = "http://localhost:3000/"
    var list = {
      name: "kwyjibo",
      rating: 0,
      visible: true,
      // activity: {
      //   activityId: "",
      //   order: 0,
      //   completed: false,
      //   accepted: false,
      //   progress: 0,
      //   location: "",
      //   reminderDate: ""
      // },
      activity: {},
      newList: newList,
      getLists: getLists
    };

    return list;

    function newList()
    {
      $log.log("creating new list...");
      $http
        .post(baseUrl + "lists",list)
        .then(function(res){
          $log.log("got new activity..." + angular.fromJson(res.data));
//          vm.user.lists.push(res.data)
        },
        function(err){
          $log.log(err);
        });
    }

    function getLists()
    {
      $log.log("getting lists...");
      return $http.get(baseUrl + "lists");
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

    }
})();
