(function(){
  'use strict';

  angular
    .module('app')
    .factory('activityDataService',activityDataService);

  activityDataService.$inject = ['$log','$http'];

  function activityDataService($log,$http) {
    var baseUrl = "http://localhost:3000/";
    var activity = {
      _id: "",
      title: "title",
      description: "",
      rating: 0,
      location: "",
      cost: "",
      duration: "duration",
      tags: "",
      newActivity: newActivity,
      getActivities: getActivities,
      showActivity: showActivity,
      setValues: setValues,
      updateActivity: updateActivity
    };

    return activity;

    function updateActivity()
    {
      $log.log("updating activity...");
      return $http.put(baseUrl + "activities/" + activity._id ,activity);
    }

    function setValues(rec)
    {
      activity._id = rec._id;
      activity.title = rec.title;
      activity.description = rec.description;
      activity.rating = rec.rating;
      activity.location = rec.location;
      activity.cost = rec.cost;
      activity.duration = rec.duration;
      activity.tags = rec.tags;
    }

    function showActivity(id)
    {
      $log.log("in showActivity...")
      return $http.get(baseUrl + "activities/" + id);
    }

    function getActivities()
    {
      return $http.get(baseUrl + "activities");
    }

    function newActivity()
    {
      $log.log("creating new activity..." + activity.title);
      $http
        .post(baseUrl + "activities",activity)
        .then(function(res){
          $log.log("got new activity..." + angular.fromJson(res.data));
          clearActivity();
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

  }
})();
