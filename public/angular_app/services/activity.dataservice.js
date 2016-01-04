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
      activities: [],
      newActivity: newActivity,
      getActivities: getActivities,
      showActivity: showActivity,
      setValues: setValues,
      clearActivity: clearActivity,
      updateActivity: updateActivity,
      vote: vote
    };

    return activity;

    function vote(act)
    {
      // even though it's not as "efficient", just pass in the entire activity since we already have it and
      // and update it instead of finding the the activity and updating just the rating
      activity._id = act._id;
      activity.title = act.title;
      activity.description = act.description;
      activity.rating = act.rating;
      activity.location = act.location;
      activity.cost = act.cost;
      activity.duration = act.duration;
      activity.tags = act.tags;
      updateActivity();
    }

    function updateActivity()
    {
      $log.log("updating activity..." + activity);
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
      $log.log("clearing activity...");
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
