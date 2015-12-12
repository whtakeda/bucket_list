(function(){
  'use strict';

  angular
    .module('app')
    .controller('MainController',MainController);

  MainController.$inject = ['$log'];

  function MainController($log) {
    var vm = this;
    vm.names = ['Nicole', 'Layne', 'Winford', 'Mattie', 'Lawanda','Joe','Mac','Sally'];
    vm.names2 = ['Jeff','Lindsey','Chris','Matthew'];
    vm.display = display;

    vm.sourceScreens = vm.names.slice();
    vm.selectedScreens = vm.names2;


    var slide = true;
    vm.toggle = function(){
      (slide) ? $('#list').slideUp() : $('#list').slideDown();
      slide = !slide;
    }

    function display()
    {
      $log.log(vm.names);
      $log.log(vm.names2);
    }



    vm.sortableOptions = {
      connectWith: ".connected-apps-container",
      stop: function (e, ui) {
        // if the element is removed from the first container
        if ($(e.target).hasClass('first') &&
            ui.item.sortable.droptarget &&
            e.target != ui.item.sortable.droptarget[0]) {
          // clone the original model to restore the removed item
          vm.names = vm.sourceScreens.slice();
        }
      },
      update: function(event, ui) {
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        if (!ui.item.sortable.received) {
          var originNgModel = ui.item.sortable.sourceModel;
          var itemModel = originNgModel[ui.item.sortable.index];
console.log(originNgModel);
console.log(itemModel);
console.log(vm.names2);
          // check that its an actual moving
          // between the two lists
          if (originNgModel == vm.names && ui.item.sortable.droptargetModel == vm.names2) {
            var exists = !!vm.names2.filter(function(x) {return x === itemModel }).length;
            if (exists) {
             ui.item.sortable.cancel();
            }
          }
        }
      }
    };
}


  // $scope.sortableOptions = {
  //   placeholder: "app",
  //   connectWith: ".apps-container",
  //   update: function(event, ui) {
  //     // on cross list sortings recieved is not true
  //     // during the first update
  //     // which is fired on the source sortable
  //     if (!ui.item.sortable.received) {
  //       var originNgModel = ui.item.sortable.sourceModel;
  //       var itemModel = originNgModel[ui.item.sortable.index];

  //       // check that its an actual moving
  //       // between the two lists
  //       if (originNgModel == $scope.list1 &&
  //           ui.item.sortable.droptargetModel == $scope.list2) {
  //         var exists = !!$scope.list2.filter(function(x) {return x.title === itemModel.title }).length;
  //         if (exists) {
  //          ui.item.sortable.cancel();
  //         }
  //       }
  //     }
  //   }
  // };

})();
