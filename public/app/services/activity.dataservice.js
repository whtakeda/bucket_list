(function(){
  'use strict';

  angular
    .module('app')
    .factory('activityDataService',activityDataService);

  activityDataService.$inject = ['$log','$http'];

  function activityDataService($log,$http) {
    var baseUrl = "http://localhost:3000/";
    var activity = {
      title: "title",
      description: "",
      rating: 0,
      location: "",
      cost: "",
      duration: "duration",
      tags: "",
      newActivity: newActivity,
      test: test
    }

    return activity;

    function newActivity()
    {
      $log.log("creating new activity.." + activity.title)
      $http
        .post(baseUrl + "activities",activity)
        .then(function(res){
            $log.log("got new activity.." + angular.fromJson(res.data));
            clearActivity();
//          vm.user.lists.push(res.data);
        },
        function(err){
          $log.log(err);
        });
    }

    function clearActivity()
    {
      activity.title = "";
      activity.description = "";
      activity.rating = 0;
      activity.location = "";
      activity.cost = "";
      activity.duration = "";
      activity.tags = "";
    }

    function test()
    {
      $log.log("testing..")
      $http
        .get(baseUrl + "test")
        .then(function(res){
            $log.log("test complete..");
        },
        function(err){
          $log.log(err);
        });
    }

  }
})();
