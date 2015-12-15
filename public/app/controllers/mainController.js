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

    vm.lists = [[{title:'Bike'},{title:'Run'},{title:'Swim'}],
                [{title:'Visit Disneyland'},{title:'Climb Mt Everest'}],
                [{title:'Write a book'},{title:'Swim the English Channel'},{title:'Sky Dive'},{title:'Visit the North Pole'}]];

    vm.test = test;

    function test(){
      debugger;
      $log.log('testing...');
    }

    getActivities();
    getLists();

    function deleteFromList(id)
    {
      vm.list.deleteActivity(id)
        .then(function(res){
          // remove activity from list
          vm.lists.forEach(function(list){
            list = vm.list.addPlaceholder(list);
          })
//          $log.log("List has been updated...");
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
//      $log.log(vm.activity);
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
              $log.log("here are the results...");
              res.data.lists[1].activity.forEach(function(a){console.log(a);});
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
        if (item.droptarget.attr('id') === 'trash') { return; }
//          debugger;

        // save the data cause it changed
        // not sure if this is considered bad style b/c i'm manually handling
        // the save, but not sure how to do it through angular with a custom directive
//        $log.log("droptarget is " + ui.item.sortable.droptarget);
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
//debugger;
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        var item = ui.item.sortable;
        if (!item.received) {
          var originNgModel = item.sourceModel;
          var itemModel = originNgModel[item.index];
          var dropTarget = item.droptargetModel;

          if (item.droptarget.attr('id') === 'trash')
          {
            $log.log(item.model._id);
            deleteFromList(item.model._id);
//            debugger;
            $('#' + item.model._id).remove();
          }
//debugger;

          // check that it's actually moving between the two lists
//          debugger;
          if (originNgModel != dropTarget && item.droptarget.attr('id') !== 'trash') {
            item.cancel();
          }
        }
      }
    };
  }

})();
