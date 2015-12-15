(function(){
  'use strict';

  angular
    .module('app')
    .factory('listDataService',listDataService);

  listDataService.$inject = ['$log','$http','$window'];

  function listDataService($log,$http,$window) {
    var baseUrl = "http://localhost:3000/";

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
      getLists: getLists,
      deleteActivity: deleteActivity,
      addPlaceholder: addPlaceholder,
      updateList: updateList
    };

    return list;

    // a placeholder needs to be added to an empty list so that it can be dragged into
    // once there is a real activity in the list, remove the placeholder
    function removePlaceholder(list)
    {
      return list.filter(function(activity){
        return activity.id !== "-1";
      });
    }

    function addPlaceholder(list)
    {
//      debugger;
      if (list.activity.length === 0)
      {
         return list.activity.push({title:"There are no activities in this list yet", id:"-1"});
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
      return $http
        .delete(baseUrl + "lists/"+id);
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
      $http
        .post(baseUrl + "lists",list)
        .then(function(res){
          $log.log("got new list..." + angular.fromJson(res.data));
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
