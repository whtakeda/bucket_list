(function(){
  'use strict';

  angular
    .module('app')
    .controller('MainController',MainController);

  MainController.$inject = ['$log'];

  function MainController($log) {
    var vm = this;
    vm.names = ['Nicole', 'Layne', 'Winford', 'Mattie', 'Lawanda','Joe','Mac','Sally'];
    vm.names2 = [['Jeff','Lindsey','Chris','Matthew'],['Jason','Ferdie','Joey','Gev']];
    vm.display = display;

    var sourceScreens = vm.names.slice();

    // TODO: refactor
    var slide = [true,true];
    vm.toggle = function(idx){
      $log.log(idx);
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
          vm.names = sourceScreens.slice();
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
          if (originNgModel == vm.names && ui.item.sortable.droptargetModel == dropTarget) {
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
