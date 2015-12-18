(function(){
  'use strict';


  angular
    .module('app', ['ui.router','ui.sortable','dndLists'])
    .config(router)
    .config(function($httpProvider) {

      // attach our auth interceptor to the http requests
      $httpProvider.interceptors.push('authInterceptor');
    });

  function router($stateProvider,$locationProvider){
    $stateProvider
      .state('home',{
        url: '/',
        templateUrl: 'templates/home.html'
      })
      .state('activities',{
        url: '/activities',
        templateUrl: 'templates/activities.html',
      })
      .state('newActivity',{
        url: '/activities/new',
        templateUrl: 'templates/new_activity.html',
        params: {isLoggedIn: false},
        onEnter: ['$state','$stateParams',function($state,$stateParams){
          if (!$stateParams.isLoggedIn) { $state.go('login') };
        }]
      })
      // .state('newActivity',{
      //   views:{
      //     'templates': {
      //       url: '/activities/new',
      //       templateUrl: 'templates/new_activity.html',
      //       // controller: "MainController",
      //       // controllerAs: "vm",
      //       params: {isLoggedIn: false}
      //     },
      //     onEnter: ['$state','$stateParams',function($state,$stateParams){
      //       if (!$stateParams.isLoggedIn) { $state.go('login') };
      //     }]
      //   }
      // })
      .state('newList',{
        url: '/lists/new',
        templateUrl: 'templates/new_list.html',
        // controller: "MainController",
        // controllerAs: "vm",
        params: {isLoggedIn: false},
        onEnter: ['$state','$stateParams',function($state,$stateParams){
          if (!$stateParams.isLoggedIn) { $state.go('login') };
        }]
      })
      .state('showActivity',{
        url: '/activity/id',
        templateUrl: 'templates/show_activity.html',
      })
      .state('showListActivity',{
        url: '/list/activity/',
        templateUrl: 'templates/list_activity.html'
      })
      .state('test',{
        url: '/test',
        templateUrl: 'templates/test.html'
      })
      .state('login',{
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: "LoginController",
        controllerAs: "vm"
      });


//    $locationProvider.html5Mode(true);
  }

})();
