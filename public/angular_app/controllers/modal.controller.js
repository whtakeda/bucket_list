angular.module('app').controller('ModalController', function ($scope, $uibModal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];
  $scope.loginData = {email:"",password:""};

  $scope.animationsEnabled = true;

  $scope.signup = function (size) {

    var modalSignup = $uibModal.open({
      animation: $scope.animationsEnabled,
//      templateUrl: 'myModalContent.html',
      templateUrl: '../templates/signup.html',
      controller: 'ModalInstanceController',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });


    modalSignup.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.login = function (size) {

    var modalLogin = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '../templates/login.html',
      controller: 'ModalInstanceController',
      size: size,
      resolve: {
        loginData: function () {
          return $scope.loginData;
        }
      }
    });


    modalLogin.result.then(function (loginData) {
      debugger;
      $scope.loginData = loginData;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.newActivity = function (size) {

    var modalNewActivity = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '../templates/new_activity.html',
      controller: 'ModalInstanceController',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });


    modalNewActivity.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.showActivity = function (size) {

    var modalShowActivity = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '../templates/show_activity.html',
      controller: 'ModalInstanceController',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });


    modalShowActivity.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.



//angular.module('app').controller('ModalInstanceController', function ($scope, $uibModalInstance, items) {
  angular
    .module('app')
    .controller('ModalInstanceController',ModalInstanceController);

  ModalInstanceController.$inject = ['$scope','$log','$http','activityDataService','listDataService','authService','userDataService','$state','$uibModalInstance'];

  function ModalInstanceController($scope,$log,$http,activityDataService,listDataService,authService,userDataService,$state,$uibModalInstance,loginData)
  {
  // $scope.items = items;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };
$scope.loginData = loginData;
  $scope.ok = function () {
    authService.login();
//    $uibModalInstance.close($scope.selected.item);
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};
