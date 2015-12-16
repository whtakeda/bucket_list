(function(){
  'use strict';

  angular
    .module('app')
    .factory('activityDataService',activityDataService);

  activityDataService.$inject = ['$log','$http'];

  function activityDataService($log,$http) {
    var activity = {
      _id: "",
      title: "",
      description: "",
      rating: 0,
      location: "",
      cost: "",
      duration: "",
      tags: "",
      newActivity: newActivity,
      getActivities: getActivities,
      showActivity: showActivity,
      setValues: setValues,
      clearActivity: clearActivity,
      updateActivity: updateActivity,
      vote: vote
    };

    return activity;

    function vote(val)
    {
      activity.rating += val;
      updateActivity();
    }

    function updateActivity()
    {
      $log.log("updating activity...");
      return $http.put("activities/" + activity._id ,activity);
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
      return $http.get("activities/" + id);
    }

    function getActivities()
    {
      $log.log("getting activities...");
      return $http.get("activities");
    }

    function newActivity()
    {
      $log.log("creating new activity..." + activity.title);
      return $http.post("activities",activity);
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
