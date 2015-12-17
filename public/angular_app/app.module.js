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
        templateUrl: 'templates/home.html',
        controller: "MainController",
        controllerAs: "vm"
      })
      .state('activities',{
        url: '/activities',
        templateUrl: 'templates/activities.html',
        controller: "MainController",
        controllerAs: "vm"
      })
      .state('newActivity',{
        url: '/activities/new',
        views:{
          'templates': {
            templateUrl: 'templates/new_activity.html',
            controller: "MainController",
            controllerAs: "vm",
            params: {isLoggedIn: false},
            onEnter: ['$state','$stateParams',function($state,$stateParams){
              if (!$stateParams.isLoggedIn) { $state.go('login') };
            }]
          }
        }
      })
      .state('newList',{
        url: '/lists/new',
        views:{
          'templates': {
            templateUrl: 'templates/new_list.html',
            controller: "MainController",
            controllerAs: "vm",
            params: {isLoggedIn: false},
            onEnter: ['$state','$stateParams',function($state,$stateParams){
              if (!$stateParams.isLoggedIn) { $state.go('login') };
            }]
          }
        }
      })
      .state('showActivity',{
        url: '/activity/:id',
        views:{
          'templates': {
            templateUrl: 'templates/show_activity.html',
            controller: "MainController",
            controllerAs: "vm"
          }
        }
      })
      .state('showListActivity',{
        url: '/list/activity/',
        views:{
          'templates': {
            templateUrl: 'templates/list_activity.html',
            controller: "MainController",
            controllerAs: "vm"
          }
        }
      })
      .state('test',{
        url: '/test',
        templateUrl: 'templates/test.html'
      })
      .state('login',{
        views:{
          'templates': {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: "LoginController",
            controllerAs: "vm"
          }
        }
      });


//    $locationProvider.html5Mode(true);
  }

})();
