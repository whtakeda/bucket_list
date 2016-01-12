(function(){
  'use strict';

  angular
    .module('app')
    .factory('listDataService',listDataService);

  listDataService.$inject = ['$log','$http','$window'];

  function listDataService($log,$http,$window) {
    var list = {
      _id: "",
      name: "",
      rating: 0,
      visible: true,
      listActivity: {
        name: "",
        activityId: "",
        order: 0,
        completed: false,
        accepted: false,
        progress: 0,
        location: "",
        reminderDate: ""
      },
      all: [],
      activity: [],
      newList: newList,
      getLists: getLists,
      deleteList: deleteList,
      deleteActivity: deleteActivity,
      addPlaceholder: addPlaceholder,
      removePlaceholder: removePlaceholder,
      updateList: updateList,
      clearList: clearList,
      saveList: saveList,
      getListActivity: getListActivity,
      setListActivity: setListActivity,
      clearListActivity: clearListActivity,
      updateListActivity: updateListActivity,
      activityExists: activityExists,
      getAllLists: getAllLists
    };

    return list;

    function getAllLists()
    {
      return $http.get("lists");
    }

    function updateListActivity()
    {
      // TODO - verify list has data before sending request.
      return $http.put("lists/activity/" + list.listActivity.activityId, list.listActivity)
    }

    function deleteList(id)
    {
      return $http.delete("lists/" + id);
    }

    function setListActivity(activity)
    {
      list.listActivity.activityId = activity._id;
      list.listActivity.name = activity.title;
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
      return $http.get("lists/" + listId + "/activity/" + activityId);
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
      if (list.activity.length === 0)
      {
         list.activity.push({title:"There are no activities in this list.  Drag an activity from the activities list", id:"-1"});
         return list;
      }
    }

//    function updateList(id,data)
    function updateList(id,list)
    {
      // // remove placeholder if necessary before updating list
      // if (data.length>1)
      // {
      //   data = removePlaceholder(data);
      // }
//      return $http.put('lists/' + id,data);
      return $http.put('lists/' + id,list);
    }

    function deleteActivity(id)
    {
      $log.log("Deleting activity..." + id)
      return $http.delete("lists/activity/" + id);
    }

    // TODO - CAN I DELETE THIS SINCE THE LOGIC IS HANDLED IN THE CUSTOM DIRECTIVE?
    function saveList()
    {
      $log.log("Updating list...")
      $http
        .put("lists",list)
        .then(function(res){
          $log.log("List has been updated...");
        },
        function(err){
          $log.log(err);
        });
    }

    function newList(id)
    {
      return $http.post("lists",{list:list,id:id});
    }

    function getLists(id)
    {
      return $http.get("users/" + id  + "/lists");
    }

    function clearList()
    {
      list.name = "";
      list.visible = true;
    }

    function clearListActivity()
    {
      list.listActivity.activityId= "";
      list.listActivity.name = "";
      list.listActivity.completed = false;
      list.listActivity.accepted = false;
      list.listActivity.progress = "";
      list.listActivity.location = "";
      list.listActivity.visible = true;
      list.listActivity.rating = 0;
      list.listActivity.reminderDate = "";
      list.listActivity.order = 0;
    }

    function activityExists(list,id)
    {
      var x = (list.filter(function(activity){
        return activity.activityId === id
      })).length > 0;
      return x;
    }
  }
})();
