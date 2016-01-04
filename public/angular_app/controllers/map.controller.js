(function(){
  'use strict';


  angular
    .module('app')
    .controller('MapController',MapController);

  MapController.$inject = ['$scope','$log','$state','uiGmapGoogleMapApi', 'mapDataService'];

  function MapController($scope,$log,$state,uiGmapGoogleMapApi,mapDataService)
  {
    var vm = this;
    vm.map = mapDataService;

    //////////////////////////////
            // vm.marker = {};
            // vm.marker.coords = {};
            // vm.marker.options = {};
            // vm.map = {center: {latitude: 34, longitude: -118 }, zoom: 4 };
            // vm.options = {scrollwheel: false};


    // vm.map.marker = {
    //   id: 0,
    //   coords: {
    //     latitude: 40.1451,
    //     longitude: -99.6680
    //   },
    //   options: { draggable: true },
    //   events: {
    //     dragend: function (marker, eventName, args) {
    //       $log.log('marker dragend');
    //       var lat = marker.getPosition().lat();
    //       var lon = marker.getPosition().lng();
    //       $log.log(lat);
    //       $log.log(lon);

    //       $scope.marker.options = {
    //         draggable: true,
    //         labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
    //         labelAnchor: "100 0",
    //         labelClass: "marker-labels"
    //       };
    //     }
    //   }
    // };

    uiGmapGoogleMapApi.then(function(maps) {
      $log.log("Map loaded");
    });  // end promise

    ////////////////////////////
  }
})();
