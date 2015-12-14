(function(){
  'use strict';

  angular
    .module('app')
    .controller('MainController',MainController);

  MainController.$inject = ['$log','activityDataService','listDataService'];

  function MainController($log,activityDataService,listDataService) {
    var vm = this;
    var sourceScreens;

//    vm.user = userDataService;
    vm.activity = activityDataService;
    vm.list = listDataService;

    vm.names = ['Nicole', 'Layne', 'Winford', 'Mattie', 'Lawanda','Joe','Mac','Sally'];
    vm.names2 = [['Jeff','Lindsey','Chris','Matthew'],['Jason','Ferdie','Joey','Gev']];
    vm.lists = [[{title:'Bike'},{title:'Run'},{title:'Swim'}],
                [{title:'Visit Disneyland'},{title:'Climb Mt Everest'}],
                [{title:'Write a book'},{title:'Swim the English Channel'},{title:'Sky Dive'},{title:'Visit the North Pole'}]];


    getActivities();
    getLists();

    function getLists()
    {
      vm.list.getLists()
        .then(function(res){
//          $log.log("res is " + angular.toJson(res.data));
          vm.lists.lists = res.data;
          console.log(vm.lists.lists);
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



    // TODO: refactor
    var slide = [true,true,true];
    vm.toggle = function(idx){
      (slide[idx]) ? $('#list'+(idx+1)).slideUp() : $('#list'+(idx+1)).slideDown();
      slide[idx] = !slide[idx];
    }


    // TODO: throwaway
    function display()
    {
      $log.log(vm.names);
      $log.log(vm.names2[0]);
      $log.log(vm.names2[1]);
    }



    vm.sortableOptions = {
      connectWith: ".connected-apps-container",
      stop: function (e, ui) {
        // if the element is removed from the first container
        if ($(e.target).hasClass('first') &&
            ui.item.sortable.droptarget &&
            e.target != ui.item.sortable.droptarget[0]) {
          // clone the original model to restore the removed item
          vm.activities = sourceScreens.slice();
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
            var exists = !!dropTarget.filter(function(x) {return x === itemModel }).length;
            if (exists) {
             ui.item.sortable.cancel();
            }
          }
        }
      }
    };
  }

})();
