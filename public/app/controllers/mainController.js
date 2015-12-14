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

    vm.names = ['Nicole', 'Layne', 'Winford', 'Mattie', 'Lawanda','Joe','Mac','Sally'];
    vm.names2 = [['Jeff','Lindsey','Chris','Matthew'],['Jason','Ferdie','Joey','Gev']];
    vm.lists = [[{title:'Bike'},{title:'Run'},{title:'Swim'}],
                [{title:'Visit Disneyland'},{title:'Climb Mt Everest'}],
                [{title:'Write a book'},{title:'Swim the English Channel'},{title:'Sky Dive'},{title:'Visit the North Pole'}]];

    vm.test = test;

    function test(){
      $log.log('testing...');
    }

    getActivities();
    getLists();

    function getLists()
    {
      vm.list.getLists()
        .then(function(res){
//          $log.log("res is " + angular.toJson(res.data));
          vm.lists = res.data;
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



    vm.sortableOptions = {
      connectWith: ".connected-apps-container",
      stop: function (e, ui) {
        // if the element is removed from the first container
        if ($(e.target).hasClass('first') &&
            ui.item.sortable.droptarget &&
            e.target != ui.item.sortable.droptarget[0]) {
          // clone the original model to restore the removed item
        console.log(ui.item.sortable.droptarget);
          var item = ui.item.sortable;
          vm.activities = sourceScreens.slice();
        $http.put(baseUrl + 'lists/' + item.droptarget.attr('id'),item.droptargetModel);
        }
      },
      update: function(event, ui) {
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        if (!ui.item.sortable.received) {
          var originNgModel = ui.item.sortable.sourceModel;
          var itemModel = originNgModel[ui.item.sortable.index];
          var dropTarget = ui.item.sortable.droptargetModel;

          // check that its an actual moving
          // between the two lists
          if (originNgModel == vm.activities && ui.item.sortable.droptargetModel == dropTarget) {
            console.log(itemModel)
            var exists = !!dropTarget.filter(function(x) {return x === itemModel }).length;
            if (exists) {
             ui.item.sortable.cancel();
            }
          }
        }
      }
    };

    vm.sortableOptions2 = {
      connectWith: ".connected-apps-container",
      stop: function (e, ui) {
        // if the element is removed from the first container

// TODO: do i even need to do this since i am updating all records in bulk?  probably not.
// but test before removing
        var target = ui.item.sortable.droptargetModel
        for (var index in target)
        {
          target[index].i = parseInt(index)+1;
        }
        // save the data cause it changed
        // not sure if this is considered bad style b/c i'm manually handling
        // the save, but not sure how to do it through angular with a custom directive
        $http.put(baseUrl + 'lists',ui.item.sortable.droptargetModel);
      },
      update: function(event, ui) {
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        if (!ui.item.sortable.received) {
          var originNgModel = ui.item.sortable.sourceModel;
          var itemModel = originNgModel[ui.item.sortable.index];
          var dropTarget = ui.item.sortable.droptargetModel;

          // check that its an actual moving
          // between the two lists
          if (originNgModel != dropTarget) {
             ui.item.sortable.cancel();
          }
        }
      }
    };

  }

})();
