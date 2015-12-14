(function(){
  'use strict';

  angular
    .module('app', ['ui.router','ui.sortable'])
    .config(router);

  function router($stateProvider){
    $stateProvider
      .state('home',{
        url: '/',
        templateUrl: 'templates/home.html'
      })
      .state('activities',{
        url: '/activities',
        templateUrl: 'templates/activities.html'
      })
      .state('newactivity',{
        url: '/activities/new',
        templateUrl: 'templates/newactivity.html'
      })
      .state('newlist',{
        url: '/lists/new',
        templateUrl: 'templates/newlist.html'
      });
  }

})();
