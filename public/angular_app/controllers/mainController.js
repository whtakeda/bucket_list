(function(){
  'use strict';

  angular
    .module('app')
    .controller('MainController',MainController);

  MainController.$inject = ['$log','$http','activityDataService','listDataService'];

  function MainController($log,$http,activityDataService,listDataService) {
    var vm = this;
    var sourceScreens;
    var slide = [];
//    vm.user = userDataService;
    vm.activity = activityDataService;
    vm.list = listDataService;
    vm.deleteFromList = deleteFromList;
    vm.getListActivity = getListActivity;
    vm.editActivity = editActivity;
    vm.newActivity = newActivity;
    vm.newList = newList;
    vm.deleteList = deleteList;
    vm.updateListActivity = updateListActivity;

    vm.lists = [];
    vm.test = test;

    function test(){
      $log.log('testing...');
    }

    getActivities();
    getLists();

    function updateListActivity()
    {
      $log.log("started updating activity list...")
      vm.list.listActivity.progress = angular.element("#progress").val();
      vm.list.updateListActivity()
        .then(function(res){
          $log.log("done updating...");
        },
        function(err){
          $log.log(err);
        });
    }

    function deleteList(id)
    {
      $log.log("deleting...." + id);
      vm.list.deleteList(id)
        .then(function(res){
          $log.log("done deleting...");
          getLists();
        },
        function(err){
          $log.log(err);
        });
    }

    function newList()
    {
      vm.list.newList()
        .then(function(res){
          getLists();
        },
        function(err){
          $log.log(err);
        });
    }

    function newActivity()
    {
      vm.activity.newActivity()
        .then(function(res){
          $log.log("got new activity..." + res.data);
          vm.activities.push(res.data)
          vm.activity.clearActivity();
        },
        function(err){
          $log.log(err);
        });
    }

    // get an activity from the user's list (not an activity directly from the activity collection)
    function getListActivity(listId,activityId)
    {

      var l = listId;
//      debugger;
      if (activityId === undefined) { return; }
      vm.list.getListActivity(listId,activityId)
        .then(function(res){
          $( "#slider" ).slider( "option", "value", res.data[0].progress )
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
          vm.lists.forEach(function(x){slide.push(true);});
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

    // not sure why but ui.sortable adds items onto the vm.list model when i cancel a drag and drop
    // this remvoes that element that was added.
    function refreshActivityList(id)
    {
      vm.lists.forEach(function(list){
        list.activity = list.activity.filter(function(a){
          return a._id != id;
        })
      })
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
$log.log("is cancelled? " + item.isCanceled());
$log.log("1. updating list...");
$log.log(item.droptargetModel);
          vm.list.updateList(item.droptarget.attr('id'),item.droptargetModel)
            .then(function(res){
              // need to update the model with the database id of the new record
              // for now this is a quick fix until i figure out how to extract just the id that i need
              vm.lists = res.data.lists;
              vm.lists.forEach(function(list) { list = vm.list.addPlaceholder(list); });
            })
        }
      },
      update: function(event, ui) {
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        var item = ui.item.sortable;

        if (item.source[0].children[0].getAttribute('name') === 'list') {item.cancel(); return; }
$log.log("activity update")

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
              // for now this is a quick fix until i figure out how to extract just the id that i need
              vm.lists = res.data.lists;
              vm.lists.forEach(function(list) { list = vm.list.addPlaceholder(list); });
            })
      },
      update: function(event, ui) {
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        var item = ui.item.sortable;
        if (item.source[0].children[0].getAttribute('name') === 'list') { item.cancel(); return; }
        if (item.model.id === "-1" || item.droptargetModel[0].id === "-1") { item.cancel(); return; }
$log.log("list update")
        if (!item.received) {
          var originNgModel = item.sourceModel;
          var itemModel = originNgModel[item.index];
          var dropTarget = item.droptargetModel;


          // check that it's actually moving between the two lists
          if (originNgModel != dropTarget) {
$log.log("cancelled from list update")
            item.cancel();

            // put this here instead of in the returned promise instead deleteFromList
            // so that it removes it from the dom asap instead of waiting for the promise to return
            // but technically should wait til it gets deleted from the db before removing it from the model
            refreshActivityList(item.model._id);
          }
        }
      }
    };

    vm.sortableHeaderOptions = {
      connectWith: ".connected-apps-container",
      update: function(event, ui) {
$log.log("header update")
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        var item = ui.item.sortable;
        if (item.droptarget.attr('id') !== "trash") { item.cancel(); return; }
//debugger;
        $('#hack').attr('data-id',item.source[0].children[0].getAttribute('data-id'))
//        $('#modal-delete').modal('show');
//        $log.log("OK got here so confirm the list delete before deleting...");
        // if (confirm("Delete this list?"))
        // {
           vm.deleteList(item.source[0].children[0].getAttribute('data-id'));
        // }

        // this is a hack to prevent a dummy activity from somehow getting added to the activity list after
        // a list is moved to the trash can.
//        item.cancel();
      }
    };




  }

})();
