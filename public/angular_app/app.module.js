(function(){
  'use strict';


  angular
    .module('app', ['ui.router','ui.sortable','dndLists'])
    .config(function($httpProvider) {

      // attach our auth interceptor to the http requests
      $httpProvider.interceptors.push('authInterceptor');
    })
    .config(router);

  function router($stateProvider,$locationProvider){
    $stateProvider
      .state('home',{
        url: '/',
        templateUrl: 'templates/home.html'
      })
      .state('activities',{
        url: '/activities',
        templateUrl: 'templates/activities.html'
      })
      .state('newActivity',{
        url: '/activities/new',
        templateUrl: 'templates/new_activity.html',
        controller: "MainController",
        controllerAs: "vm"
      })
      .state('newList',{
        url: '/lists/new',
        templateUrl: 'templates/new_list.html',
        controller: "MainController",
        controllerAs: "vm"
      })
      .state('showActivity',{
        url: '/activity/:id',
        templateUrl: 'templates/show_activity.html',
        onExit: function(){
          // $('#main').slideUp(1000);
        },
        onEnter: function(){
          console.log("entering denver");
          // $('#main').slideDown(1000);
          console.log("hi denver");
        }
      })
      .state('showListActivity',{
        url: '/list/activity/',
        templateUrl: 'templates/list_activity.html',
        onExit: function(){
          console.log("leaving las vegas");
          // $('#main').slideUp(1000);
          return true;
          console.log("bye las vegas");
        },
        onEnter: function(){
          // $('#main').slideDown(1000);
        }
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
