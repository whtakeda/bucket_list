(function(){
  'use strict';


  angular
    .module('app')
    .controller('MainController',MainController);

  MainController.$inject = ['$scope','$log','$http','activityDataService','listDataService','authService','userDataService','$state','$uibModal','uiGmapGoogleMapApi','mapDataService'];

  function MainController($scope,$log,$http,activityDataService,listDataService,authService,userDataService,$state,$uibModal,uiGmapGoogleMapApi,mapDataService)
  {
    var vm = this;
    var activitiesCopy;
    var slide = [];

    vm.user = userDataService;
    vm.activity = activityDataService;
    vm.list = listDataService;
    vm.deleteFromList = deleteFromList;
    vm.getListActivity = getListActivity;
    vm.editActivity = editActivity;
    vm.newActivity = newActivity;
    vm.newList = newList;
    vm.deleteList = deleteList;
    vm.updateListActivity = updateListActivity;
//    vm.showActivity = showActivity;
//    vm.showListActivityView = showListActivityView;
//    vm.showActivityView = showActivityView;
    // vm.display = display;
    vm.cancel = cancel;
    vm.signup = signup;
    vm.addToList = addToList;

    vm.map = mapDataService;

    vm.lists = [];
    vm.test = test;

//    vm.currentUser = userDataService.currentUser;
    vm.logout = logout;
    vm.isLoggedIn = authService.isLoggedIn;


    vm.$state = $state;


    userDataService.currentUser().then(function(res){
      vm.currentUser = res.data;
      userDataService.currentUserData(vm.currentUser._id)
        .then(function(res){
          userDataService.data = res.data;
          // because activity data is stored separately, i want to combine
          // the information into the user activities
          userDataService.data.lists.forEach(function(list){
            list.activity.forEach(function(activity){
              var a = vm.activity.activities.filter(function(act){
                return act._id === activity.activityId;
              })[0];
              activity.title = a.title;
              activity.location = a.location;
              activity.cost = a.cost; // TODO: currently not using this????
              activity.description = a.description;
            })
          })
          // load other user lists only after loading current user
          vm.list.getAllLists()
            .then(function(res){
              vm.list.all = res.data.filter(function(users){
                return users._id !== vm.currentUser._id;
              });
            })

        },
        function(err){
          $log.log(err);
        });
    },
    function(err){
      $log.log(err);
    });

//     userDataService.currentUser().then(function(res){
//       vm.currentUser = res.data;
//       userDataService.currentUserData(vm.currentUser._id)
//         .then(function(res){
//           vm.user = res.data;
//           vm.user.lists.forEach(function(list){
// //            list = vm.list.addPlaceholder(list);
//           })
//         },
//         function(err){
//           $log.log(err);
//         });
//     },
//     function(err){
//       $log.log(err);
//     });

    function test()
    {
      $log.log('testing...' + angular.toJson(vm.user.data));
    }

    getActivities();


    function signup()
    {
      vm.user.signup()
        .then(function(res){
          $state.go('login');
        },
        function(err){
          $log.log(err);
        });
      vm.user.signupName = "";
      vm.user.signupEmail = "";
      vm.user.signupPassword = "";
    }

    function cancel()
    {
      $('#main').fadeOut(500,function(){$state.go('home')});
    }

    function addToList(activity)
    {
      // don't add duplicates
      if (vm.list.activityExists(vm.user.data.lists[0].activity,activity._id)) { return; }
      activity = {title:activity.title,activityId:activity._id, accepted:true, progress:0};
      vm.user.data.lists[0].activity.push(activity);
      vm.list.updateList(vm.user.data.lists[0]._id,vm.user.data.lists[0].activity)
        .then(function(res){
          vm.user.data.lists[0].activity[vm.user.data.lists[0].activity.length-1]._id = res.data._id;
        },
        function(err){
          $log.log(err);
        });
    }

    function deleteFromList(id)
    {
      $log.log("deleting list with id..." + id);
      vm.list.deleteActivity(id)
        .then(function(res){
          vm.user.data.lists[0].activity = vm.user.data.lists[0].activity.filter(function(activity){
            return activity._id !== id;
          });
          cancel();
        },
        function(err){
          $log.log(err);
        });
    }

    function logout()
    {
      vm.currentUser = "";
      vm.user.data.lists = {};
      vm.list.clearList();
      vm.list.clearListActivity();
      vm.list.activity = [];
      authService.logout();
    }

    function updateListActivity()
    {
      vm.list.listActivity.progress = parseInt(angular.element("#progress").val());
      var activity = vm.user.data.lists[0].activity.filter(function(activity){
        return activity._id === vm.list.listActivity.activityId;
      })
      activity[0].progress = parseInt(angular.element("#progress").val());
      vm.list.updateListActivity()
        .then(function(res){
          vm.list.clearListActivity();
        },
        function(err){
          $log.log(err);
        });
    }

    function getActivities()
    {
      vm.activity.getActivities()
        .then(function(res){
          vm.activity.activities = res.data;
          activitiesCopy = vm.activity.activities.slice();
        },
        function(err){
          $log.log(err);
        });
    }

    function getActivityLocation()
    {

    }


///////////////////////////////////////////////////////////////////////
    // function showActivityView()
    // {
    //   $state.go('showActivity');
    // }

    // function showListActivityView()
    // {
    //   $state.go('showListActivity');
    // }

    // function showActivity(id)
    // {
    //   $log.log("getting activity with id..." + id)
    //   if (id===undefined) { return; }
    //   vm.activity.showActivity(id)
    //     .then(function(res){
    //       vm.activity.setValues(res.data[0]);
    //     },
    //     function(err){
    //       $log.log(err);
    //     });
    // }


    function deleteList(id)
    {
      vm.list.deleteList(id)
        .then(function(res){
          // just remove list from currentUser
//          getLists();
        },
        function(err){
          $log.log(err);
        });
    }

    function newList()
    {
      vm.list.newList(vm.currentUser._id)
        .then(function(res){
          console.log("created new list " + angular.toJson(res.data));
          // TODO
          // just insert list into currentUser
//          getLists();
          res.data.activity = [];
//          res.data = vm.list.addPlaceholder(res.data);
          slide.push(true);

//          vm.lists.push(res.data);
          vm.user.data.lists.push(res.data);
          vm.list.clearList();
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
          vm.activity.activities.push(res.data)
          vm.activity.clearActivity();
          $state.go('home');
        },
        function(err){
          $log.log(err);
        });
    }

    // get an activity from the user's list (not an activity directly from the activity collection)
    function getListActivity(listId,activityId)
    {
      if (activityId === undefined) { return; }
      vm.list.getListActivity(listId,activityId)
        .then(function(res){
          $( "#slider" ).slider( "option", "value", res.data[0].progress )
          vm.list.setListActivity(res.data[0]);
        },
        function(err){
          $log.log(err);
        })
    }

    // use this to update a single activity that has been created by the user
    // (not necessarily one that is part of their list)
    function editActivity(id)
    {
      if (id===undefined) { return; }
      vm.activity.showActivity(id)
        .then(function(res){
          vm.activity.setValues(res.data[0]);
        },
        function(err){
          $log.log(err);
        })
    }

    // update lists this way because we need to check the length and
    // add placeholder value if the list is now empty
    // this only needs to be called when the user logs in
    function getLists(id)
    {
      vm.list.getLists(id)
        .then(function(res){
          // $log.log("res is " + angular.toJson(res.data));
          vm.lists = res.data;
          vm.lists.forEach(function(list){
//            list = vm.list.addPlaceholder(list);
          });
          slide = [];
          vm.lists.forEach(function(x){slide.push(true);});
        },
        function(err){
          $log.log(err);
        });
    }


    // function initialize()
    // {
    //   // do stuff here to set up initial view
    //   slide.forEach(function(x,idx){$('#'+(idx)).slideUp()})
    // }

    vm.toggle = function(idx){
      (slide[idx]) ? $('#'+(idx)).slideUp() : $('#'+(idx)).slideDown();
      slide[idx] = !slide[idx];
    }

    // TODO: throwaway
    // function display()
    // {
    //   $log.log(vm.activity);
    //   $log.log(angular.toJson(vm.lists[0].activity[0]));
    //   $log.log(angular.toJson(vm.lists[0].activity[1]));
    // }

    // not sure why but ui.sortable adds items onto the vm.list model when i cancel a drag and drop
    // this remvoes that element that was added.
    // function refreshActivityList(id)
    // {
    //   vm.lists.forEach(function(list){
    //     list.activity = list.activity.filter(function(a){
    //       return a._id != id;
    //     })
    //   })
    // }

///////////////////////
    vm.modalLogin = modalLogin;
    vm.modalSignup = modalSignup;
    vm.modalNewActivity = modalNewActivity;
    vm.modalShowActivity = modalShowActivity;
    vm.modalShowListActivity = modalShowListActivity;
    vm.modalShowListActivityOther = modalShowListActivityOther;
    vm.loginData = {email:"", password:""};

    function modalLogin() {
      $uibModal.open({
        animation: true,
        templateUrl: '../templates/login.html',
        size: 'md',
        controller: ModalInstanceController,
        controllerAs: 'vm'
      });
    }

    function modalSignup() {
      $uibModal.open({
        animation: true,
        templateUrl: '../templates/signup.html',
        size: 'md',
        controller: ModalInstanceController,
        controllerAs: 'vm'
      });
    }

    function modalNewActivity()
    {
      $uibModal.open({
        animation: true,
        templateUrl: '../templates/new_activity.html',
        controller: ModalInstanceController,
        controllerAs: 'vm'
      });
    }

    function modalShowActivity(id)
    {
      vm.activity._id = id;

      var activity = vm.activity.activities.filter(function(activity){
        return activity._id === id;
      });

      vm.map.geocodeAddress(activity[0].location,function(res){
        if (res !== "")
        {
          vm.map.center = {latitude: res.lat(),longitude: res.lng()};
          vm.map.marker.id = "1";
          vm.map.marker.coords = {latitude: res.lat(),longitude: res.lng()};
        }
        else
        {
          vm.map.marker.id = "0";
        }

        $uibModal.open({
          animation: true,
          templateUrl: '../templates/show_activity.html',
          size: 'lg',
          controller: ModalInstanceController,
          controllerAs: 'vm'
        });
      });

    }

    function modalShowListActivity(id,activityId)
    {
      vm.activity._id = id;

      var activity = vm.activity.activities.filter(function(activity){
        return activity._id === activityId;
      });

      vm.map.geocodeAddress(activity[0].location,function(res){
        if (res !== "")
        {
          vm.map.center = {latitude: res.lat(),longitude: res.lng()};
          vm.map.marker.id = "1";
          vm.map.marker.coords = {latitude: res.lat(),longitude: res.lng()};
        }
        else
        {
          vm.map.marker.id = "0";
        }

        $uibModal.open({
          animation: true,
          templateUrl: '../templates/list_activity.html',
          size: 'lg',
          controller: ModalInstanceController,
          controllerAs: 'vm'
        });
      });
    }

    function modalShowListActivityOther(id,activityId)
    {
      vm.activity._id = id;

      vm.activity.currActivity = vm.activity.activities.filter(function(activity){
        return activity._id === activityId;
      })[0];

      vm.map.geocodeAddress(vm.activity.currActivity.location,function(res){
        if (res !== "")
        {
          vm.map.center = {latitude: res.lat(),longitude: res.lng()};
          vm.map.marker.id = "1";
          vm.map.marker.coords = {latitude: res.lat(),longitude: res.lng()};
        }
        else
        {
          vm.map.marker.id = "0";
        }

        $uibModal.open({
          animation: true,
          templateUrl: '../templates/list_activity_other.html',
          size: 'lg',
          controller: ModalInstanceController,
          controllerAs: 'vm'
        });
      });
    }

  } // end main controller

ModalInstanceController.$inject = ['userDataService', 'authService', '$uibModalInstance', 'loginDataService', 'activityDataService', '$state', '$log', 'uiGmapGoogleMapApi']

function ModalInstanceController(userDataService, authService, $uibModalInstance, loginDataService, activityDataService, $state, $log, $uiGmapGoogleMapApi)
{
  var vm = this;
  vm.user = userDataService;
  vm.loginData = loginDataService;
  vm.activity = activityDataService;

  vm.isLoggedIn = authService.isLoggedIn;

  vm.login = login;
  vm.signup = signup;
  vm.newActivity = newActivity;
  vm.updateUser = updateUser;
  vm.deleteFromList = deleteFromList;
  vm.cancel = cancel;

  function login()
  {
    loginDataService.login();
    $uibModalInstance.close();
  }

  function signup()
  {
      vm.user.signup()
        .then(function(res){
          $uibModalInstance.close();
        },
        function(err){
          $log.log(err);
        });
      vm.user.signupName = "";
      vm.user.signupEmail = "";
      vm.user.signupPassword = "";
  }

  function newActivity()
  {
    vm.activity.newActivity()
      .then(function(res){
        $log.log("got new activity..." + res.data);
        vm.activity.activities.push(res.data)
        vm.activity.clearActivity();
        $uibModalInstance.close();
      },
      function(err){
        $log.log(err);
      });
  }

  function updateUser(id)
  {
    vm.user.update(id)
      .then(function(res){
        $uibModalInstance.close();
      },
      function(err){
        $log.log(err);
      });
  }

  function deleteFromList(id)
  {
    vm.user.data.lists[0].activity = vm.user.data.lists[0].activity.filter(function(activity){
      return activity.activityId !== id;
    });
    vm.user.update(vm.user.data._id)
      .then(function(res){
        $uibModalInstance.close();
      },
      function(err){
        $log.log(err);
      });
  }

  function cancel()
  {
    $uibModalInstance.close();
  }

}


})();
