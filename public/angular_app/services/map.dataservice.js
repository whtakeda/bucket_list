(function(){
  'use strict';

  angular
    .module('app')
    .factory('mapDataService',mapDataService);

  mapDataService.$inject = ['$log'];

  function mapDataService($log,$http,$window) {
    var mapObj = {
      marker: {
        id: "",
        coords: {
          latitude: 0,
          longitude: 0
        },
        labelContent: "hi",
        events: {}
      },
      center: {latitude: 0, longitude: 0 },
      zoom: 6,
      options: {scrollwheel: false},
      geocodeAddress: geocodeAddress
    };

    return mapObj;

    function geocodeAddress(address, callback){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              callback(results[0].geometry.location);
          } else {
              callback("");
//              console.log("Geocode was not successful for the following reason: " + status);
          }
      });
    }
  }

})();
