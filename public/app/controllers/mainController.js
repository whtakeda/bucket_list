(function(){
  'use strict';

  angular
    .module('app')
    .controller('MainController',MainController);

  MainController.$inject = ['$log','$http','activityDataService','listDataService'];

  function MainController($log,$http,activityDataService,listDataService) {
    var vm = this;
    var baseUrl = "http://localhost:3000/"
    var sourceScreens;
    var slide = [];

//    vm.user = userDataService;
    vm.activity = activityDataService;
    vm.list = listDataService;
    vm.deleteFromList = deleteFromList;
    vm.getListActivity = getListActivity;
    vm.editActivity = editActivity;

    vm.lists = [[{title:'Bike'},{title:'Run'},{title:'Swim'}],
                [{title:'Visit Disneyland'},{title:'Climb Mt Everest'}],
                [{title:'Write a book'},{title:'Swim the English Channel'},{title:'Sky Dive'},{title:'Visit the North Pole'}]];

    vm.test = test;

    function test(){
      $log.log('testing...');
    }

    getActivities();
    getLists();

    // get an activity from the user's list (not an activity directly from the activity collection)
    function getListActivity(listId,activityId)
    {
//      debugger;
      if (activityId===undefined) { return; }
      vm.list.getListActivity(listId,activityId)
        .then(function(res){
          vm.list.setListActivity(res.data[0]);
        })
    }

    // use this to update a single activity that has been created by the user
    // (not necessarily one that is part of their list)
    function editActivity(id)
    {
//      debugger;
      if (id===undefined) { return; }
      vm.activity.showActivity(id)
        .then(function(res){
//          debugger;
          vm.activity.setValues(res.data[0]);
        })
    }

    function deleteFromList(id)
    {
      vm.list.deleteActivity(id)
        .then(function(res){
          // need to do 3 things
          // 1) remove from dom
          // 2) remove from model
          // 3) check if list is empty and add placeholder if necessary
          $('#' + id).remove();
          vm.lists.forEach(function(list){
            list.activity = list.activity.filter(function(a){
              return a._id != id;
            })
          })
          vm.lists.forEach(function(list){
            list = vm.list.addPlaceholder(list);
          })
        },
        function(err){
          $log.log(err);
        });
    }

    function getLists()
    {
      vm.list.getLists()
        .then(function(res){
//          $log.log("res is " + angular.toJson(res.data));
          vm.lists = res.data;
//          debugger;
          vm.lists.forEach(function(list){
            list = vm.list.addPlaceholder(list);
          })
          // vm.lists[0].activity[0].i = 1;
          // vm.lists[0].activity[1].i = 2;
          vm.lists.forEach(function(x){slide.push(false);});
        },
        function(err){
          $log.log(err);
        });
    }

    function getActivities()
    {
      vm.activity.getActivities()
        .then(function(res){
//          $log.log("res is " + angular.toJson(res.data));
          vm.activities = res.data;
          sourceScreens = vm.activities.slice();
        },
        function(err){
          $log.log(err);
        });
    }

    vm.display = display;

    function initialize()
    {
      // do stuff here to set up initial view
      slide.forEach(function(x,idx){$('#'+(idx)).slideUp()})
    }

    // TODO: refactor
    vm.toggle = function(idx){
      (slide[idx]) ? $('#'+(idx)).slideUp() : $('#'+(idx)).slideDown();
      slide[idx] = !slide[idx];
    }

    // TODO: throwaway
    function display()
    {
      $log.log(vm.activity);
      $log.log(angular.toJson(vm.lists[0].activity[0]));
      $log.log(angular.toJson(vm.lists[0].activity[1]));
    }

    vm.sortableActivityOptions = {
      connectWith: ".connected-apps-container",
      stop: function (e, ui) {
$log.log("activity stop")
        // if the element is removed from the first container
        var item = ui.item.sortable;
        if (item.isCanceled()) { return; }
        if (item.droptarget.attr('id') === 'trash') { return; }


        if ($(e.target).hasClass('first') &&
            item.droptarget &&
            e.target != item.droptarget[0]) {
          // clone the original model to restore the removed item

          vm.activities = sourceScreens.slice();
$log.log("is cancelled? " + item.isCanceled())
          $log.log("1. updating list...")
          $log.log(item.droptargetModel);
          vm.list.updateList(item.droptarget.attr('id'),item.droptargetModel)
            .then(function(res){
//              debugger;
//              $log.log("here are the results...");
//              res.data.lists[1].activity.forEach(function(a){console.log(a);});
              // need to update the model with the database id of the new record
              // for now this is a quick fix until i figure out how to extract just the id that i need
              vm.lists = res.data.lists;
              vm.lists.forEach(function(list) { list = vm.list.addPlaceholder(list); });
            })
        }
      },
      update: function(event, ui) {
$log.log("activity update")
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        var item = ui.item.sortable;
        if (!item.received) {
          var originNgModel = item.sourceModel;
          var itemModel = originNgModel[item.index];
          var dropTarget = item.droptargetModel;


          // check that its an actual moving
          // between the two lists
//          debugger;
          if (originNgModel == vm.activities && item.droptargetModel == dropTarget) {
            console.log(itemModel)
//            debugger;
            var exists = !!dropTarget.filter(function(x) {return x.activityId === itemModel._id }).length;
            if (exists) {
              $log.log("cancelling because it exists...");
              item.cancel();
            }
          }
        }
      }
    };

    vm.sortableListOptions = {
      connectWith: ".connected-apps-container",
      stop: function (e, ui) {
$log.log("list stop")
        // if the element is removed from the first container

        var item = ui.item.sortable;
        if (item.model.id === "-1" || item.droptargetModel === undefined || item.droptargetModel[0].id === "-1") { item.cancel(); return; }
            if (item.droptarget.attr('id') === 'trash')
            {
              $log.log(item.model._id);
              deleteFromList(item.model._id);

//              $('#' + item.model._id).remove();
            }
        if (item.isCanceled()) { return; }
        if (item.droptarget.attr('id') === 'trash') { return; }

        // save the data cause it changed
        // not sure if this is considered bad style b/c i'm manually handling
        // the save, but not sure how to do it through angular with a custom directive
//        $log.log("droptarget is " + ui.item.sortable.droptarget);
$log.log("is cancelled? " + item.isCanceled())
          $log.log("2. updating list...")
          vm.list.updateList(item.droptarget.attr('id'),item.droptargetModel)
            .then(function(res){
              // need to update the model with the database id of the new record
              res.data.lists[1].activity.forEach(function(a){console.log(a);});
              // need to update the model with the database id of the new record
              // for now this is a quick fix until i figure out how to extract just the id that i need
              vm.lists = res.data.lists;
              vm.lists.forEach(function(list) { list = vm.list.addPlaceholder(list); });
            })
      },
      update: function(event, ui) {
$log.log("list update")
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        var item = ui.item.sortable;
        if (item.model.id === "-1" || item.droptargetModel[0].id === "-1") { item.cancel(); return; }
        if (!item.received) {
          var originNgModel = item.sourceModel;
          var itemModel = originNgModel[item.index];
          var dropTarget = item.droptargetModel;

          // TODO - verify but can probably delete this code
          // if (item.droptarget.attr('id') === 'trash')
          // {
          //   $log.log(item.model._id);
          //   deleteFromList(item.model._id);
          //   $('#' + item.model._id).remove();
          // }

          // check that it's actually moving between the two lists
          if (originNgModel != dropTarget) {
            $log.log("cancelled from list update")
            item.cancel();
          }
        }
      }
    };
  }

})();
