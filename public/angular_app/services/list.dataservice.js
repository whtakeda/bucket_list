(function(){
  'use strict';

  angular
    .module('app')
    .factory('listDataService',listDataService);

  listDataService.$inject = ['$log','$http','$window'];

  function listDataService($log,$http,$window) {
    var baseUrl = "http://localhost:3000/";

    var list = {
      _id: "",
      name: "",
      rating: 0,
      visible: true,
      listActivity: {
        activityId: "",
        order: 0,
        completed: false,
        accepted: false,
        progress: 0,
        location: "",
        reminderDate: ""
      },
      activity: [],
      newList: newList,
      getLists: getLists,
      deleteList: deleteList,
      deleteActivity: deleteActivity,
      addPlaceholder: addPlaceholder,
      updateList: updateList,
      getListActivity: getListActivity,
      setListActivity: setListActivity,
      updateListActivity: updateListActivity
    };

    return list;

    function updateListActivity()
    {
//      debugger;
      return $http.put(baseUrl + "lists/activity/" + list.listActivity.activityId, list.listActivity)
    }

    function deleteList(id)
    {
      return $http.delete(baseUrl + "lists/" + id);
    }

    function setListActivity(activity)
    {
//      debugger;
      list.listActivity.activityId = activity._id;
      list.listActivity.completed = activity.completed;
      list.listActivity.accepted = activity.accepted;
      list.listActivity.progress = activity.progress;
      list.listActivity.location = activity.location;
      list.listActivity.reminderDate = activity.reminderDate;
      list.listActivity.order = activity.order;
    }

    function getListActivity(listId,activityId)
    {
      $log.log("getting activity from list..." + listId);
      $log.log("getting activity from list..." + activityId);
      return $http.get(baseUrl + "lists/" + listId + "/activity/" + activityId);
    }

    // a placeholder needs to be added to an empty list so that it can be dragged into
    // once there is a real activity in the list, remove the placeholder
    function removePlaceholder(list)
    {
      return list.filter(function(activity){
        return activity.id !== "-1";
      });
    }

    // adds the placeholder.  see previous function for additional info
    function addPlaceholder(list)
    {
//      debugger;
      if (list.activity.length === 0)
      {
         return list.activity.push({title:"There are no activities in this list.  Drag an activity from the activities list", id:"-1"});
      }
    }

    function updateList(id,data)
    {
      // remove placeholder if necessary before updating list
//      debugger;
      if (data.length>1)
      {
//        debugger;
        data = removePlaceholder(data);
      }
      return $http.put(baseUrl + 'lists/' + id,data);
    }

    function deleteActivity(id)
    {
      $log.log("Deleting activity..." + id)
      return $http.delete(baseUrl + "lists/activity/" + id);
    }

    // TODO - CAN I DELETE THIS SINCE THE LOGIC IS HANDLED IN THE CUSTOM DIRECTIVE?
    function saveList()
    {
      $log.log("Updating list...")
      $http
        .put(baseUrl + "lists",list)
        .then(function(res){
          $log.log("List has been updated...");
        },
        function(err){
          $log.log(err);
        });
    }

    function newList()
    {
      $log.log("creating new list...");
      return $http.post(baseUrl + "lists",list);
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
