(function(){
  'use strict';

  angular
    .module('app', ['ui.router','ui.sortable'])
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
        templateUrl: 'templates/new_activity.html'
      })
      .state('newList',{
        url: '/lists/new',
        templateUrl: 'templates/new_list.html'
      })
      .state('showActivity',{
        url: '/activity/:id',
        templateUrl: 'templates/activity.html'
      })
      .state('showListActivity',{
        url: '/list/activity/',
        templateUrl: 'templates/list_activity.html'
      });

//    $locationProvider.html5Mode(true);
  }

})();
